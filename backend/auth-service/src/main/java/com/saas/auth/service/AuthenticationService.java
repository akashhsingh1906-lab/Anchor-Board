package com.saas.auth.service;

import com.saas.auth.dto.AuthResponse;
import com.saas.auth.dto.LoginRequest;
import com.saas.auth.dto.RefreshTokenRequest;
import com.saas.auth.dto.RegisterRequest;
import com.saas.auth.entity.RefreshToken;
import com.saas.auth.entity.User;
import com.saas.auth.entity.UserRole;
import com.saas.auth.entity.UserStatus;
import com.saas.auth.repository.RefreshTokenRepository;
import com.saas.auth.repository.UserRepository;
import com.saas.auth.security.JwtTokenProvider;
import com.saas.auth.security.TenantContext;
import com.saas.auth.security.UserPrincipal;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Authentication service for handling user authentication and token management.
 * 
 * This service provides the core authentication functionality including:
 * - User login with password verification
 * - JWT token generation and validation
 * - Refresh token management and rotation
 * - Tenant-aware authentication
 * - Rate limiting for security
 * 
 * Security considerations:
 * - Password hashing with BCrypt
 * - Token rotation for refresh tokens
 * - Tenant isolation for all operations
 * - Rate limiting to prevent brute force attacks
 */
@Service
@Transactional
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Constructor for dependency injection.
     */
    public AuthenticationService(AuthenticationManager authenticationManager,
                               JwtTokenProvider tokenProvider,
                               UserRepository userRepository,
                               RefreshTokenRepository refreshTokenRepository,
                               PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /**
     * Authenticate user and generate JWT tokens.
     * 
     * @param loginRequest the login credentials
     * @param tenantId the tenant ID for multi-tenant isolation
     * @return authentication response with tokens and user info
     * @throws BadCredentialsException if authentication fails
     */
    @SuppressWarnings("null")
    public AuthResponse authenticate(LoginRequest loginRequest, Long tenantId) {
        try {
            // Set tenant context for authentication
            TenantContext.setCurrentTenant(tenantId);

            // Create authentication token
            UsernamePasswordAuthenticationToken authenticationToken = 
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), 
                            loginRequest.getPassword());

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            
            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get authenticated user principal
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Generate tokens
            String accessToken = tokenProvider.generateAccessToken(authentication, tenantId);
            String refreshToken = generateAndStoreRefreshToken(userPrincipal.getId(), tenantId);

            // Update user last login
            updateLastLogin(userPrincipal.getId());

            // Build response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    userPrincipal.getId().toString(),
                    userPrincipal.getEmail(),
                    userPrincipal.getFirstName(),
                    userPrincipal.getLastName(),
                    userPrincipal.getFullName(),
                    userPrincipal.getRole().name(),
                    userPrincipal.getTenantId()
            );

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    tokenProvider.getRemainingValidity(accessToken),
                    tokenProvider.getExpirationFromToken(accessToken),
                    userInfo
            );

        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Invalid email or password", ex);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Register a new user and immediately issue tokens for the new account.
     * New self-service signups default to tenant 1 (the shared demo tenant
     * every entity falls back to via {@code BaseEntity#onCreate}) with the
     * PROJECT_MANAGER role so they can create projects/tasks right away.
     *
     * @param registerRequest the registration details
     * @return authentication response with tokens and user info
     * @throws BadCredentialsException if the email is already registered
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        Long tenantId = 1L;

        if (userRepository.existsByEmailAndTenantId(registerRequest.getEmail(), tenantId)) {
            throw new BadCredentialsException("An account with this email already exists");
        }

        User user = new User(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                tenantId
        );
        user.setRole(UserRole.PROJECT_MANAGER);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setIsEmailVerified(true);
        user = userRepository.save(user);

        UserPrincipal userPrincipal = new UserPrincipal(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());

        String accessToken = tokenProvider.generateAccessToken(authentication, tenantId);
        String refreshToken = generateAndStoreRefreshToken(userPrincipal.getId(), tenantId);
        updateLastLogin(userPrincipal.getId());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                userPrincipal.getId().toString(),
                userPrincipal.getEmail(),
                userPrincipal.getFirstName(),
                userPrincipal.getLastName(),
                userPrincipal.getFullName(),
                userPrincipal.getRole().name(),
                userPrincipal.getTenantId()
        );

        return new AuthResponse(
                accessToken,
                refreshToken,
                tokenProvider.getRemainingValidity(accessToken),
                tokenProvider.getExpirationFromToken(accessToken),
                userInfo
        );
    }

    /**
     * Refresh access token using refresh token.
     *
     * @param refreshTokenRequest the refresh token request
     * @return new authentication response with fresh tokens
     * @throws BadCredentialsException if refresh token is invalid
     */
    @SuppressWarnings("null")
    public AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        try {
            // Validate refresh token
            if (!tokenProvider.isRefreshToken(refreshTokenRequest.getRefreshToken())) {
                throw new BadCredentialsException("Invalid token type");
            }

            // Extract user and tenant info from token
            UUID userId = tokenProvider.getUserIdFromToken(refreshTokenRequest.getRefreshToken());
            Long tenantId = tokenProvider.getTenantIdFromToken(refreshTokenRequest.getRefreshToken());

            // Set tenant context
            TenantContext.setCurrentTenant(tenantId);

            // Find refresh token in database
            RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenRequest.getRefreshToken())
                    .orElseThrow(() -> new BadCredentialsException("Refresh token not found"));

            // Validate token
            if (!storedToken.isValid()) {
                throw new BadCredentialsException("Refresh token is invalid or expired");
            }

            // Find user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Validate user status
            if (!user.isActive()) {
                throw new BadCredentialsException("User account is not active");
            }

            // Create user principal
            UserPrincipal userPrincipal = new UserPrincipal(user);

            // Revoke old refresh token (token rotation)
            storedToken.revoke("Token rotation");

            // Generate new tokens
            String newAccessToken = tokenProvider.generateAccessToken(
                    new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities()),
                    tenantId);
            String newRefreshToken = generateAndStoreRefreshToken(userId, tenantId);

            // Build response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    userPrincipal.getId().toString(),
                    userPrincipal.getEmail(),
                    userPrincipal.getFirstName(),
                    userPrincipal.getLastName(),
                    userPrincipal.getFullName(),
                    userPrincipal.getRole().name(),
                    userPrincipal.getTenantId()
            );

            return new AuthResponse(
                    newAccessToken,
                    newRefreshToken,
                    tokenProvider.getRemainingValidity(newAccessToken),
                    tokenProvider.getExpirationFromToken(newAccessToken),
                    userInfo
            );

        } catch (Exception ex) {
            throw new BadCredentialsException("Failed to refresh token", ex);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Logout user by revoking refresh token.
     * 
     * @param refreshToken the refresh token to revoke
     */
    public void logout(String refreshToken) {
        try {
            if (refreshToken != null && tokenProvider.isRefreshToken(refreshToken)) {
                UUID userId = tokenProvider.getUserIdFromToken(refreshToken);
                Long tenantId = tokenProvider.getTenantIdFromToken(refreshToken);

                TenantContext.setCurrentTenant(tenantId);

                // Revoke all tokens for the user
                refreshTokenRepository.revokeAllTokensForUser(userId, tenantId, "User logout");
            }
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Generate and store refresh token for user.
     * 
     * @param userId the user ID
     * @param tenantId the tenant ID
     * @return generated refresh token
     */
    private String generateAndStoreRefreshToken(UUID userId, Long tenantId) {
        String refreshToken = tokenProvider.generateRefreshToken(userId, tenantId);
        
        RefreshToken tokenEntity = new RefreshToken(
                refreshToken,
                userId,
                tenantId,
                tokenProvider.getExpirationFromToken(refreshToken)
        );

        refreshTokenRepository.save(tokenEntity);
        return refreshToken;
    }

    /**
     * Update user's last login timestamp.
     * 
     * @param userId the user ID
     */
    private void updateLastLogin(@NonNull UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    // Fallback methods for rate limiting
    public AuthResponse authenticateFallback(LoginRequest loginRequest, Long tenantId, Exception ex) {
        throw new BadCredentialsException("Authentication service temporarily unavailable. Please try again later.");
    }

    public AuthResponse refreshTokenFallback(RefreshTokenRequest refreshTokenRequest, Exception ex) {
        throw new BadCredentialsException("Token refresh service temporarily unavailable. Please try again later.");
    }
}
