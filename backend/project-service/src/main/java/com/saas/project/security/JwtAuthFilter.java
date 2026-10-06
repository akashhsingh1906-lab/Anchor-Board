package com.saas.project.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Validates the JWT issued by auth-service and populates the security
 * context so {@code @PreAuthorize} checks (e.g. hasRole/authentication.principal.id)
 * work the same way here as they would behind a single monolith.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${app.jwt.secret:mySecretKey123456789012345678901234567890}")
    private String jwtSecret;

    @Value("${app.jwt.issuer:saas-auth-service}")
    private String issuer;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(getSigningKey())
                        .requireIssuer(issuer)
                        .build()
                        .parseSignedClaims(header.substring(7))
                        .getPayload();

                UUID userId = UUID.fromString(claims.getSubject());
                Long tenantId = claims.get("tenantId", Long.class);
                String rolesClaim = claims.get("roles", String.class);

                List<GrantedAuthority> authorities = rolesClaim == null
                        ? List.of()
                        : List.of(rolesClaim.split(",")).stream()
                                .map(SimpleGrantedAuthority::new)
                                .map(a -> (GrantedAuthority) a)
                                .toList();

                JwtPrincipal principal = new JwtPrincipal(userId, claims.get("email", String.class), tenantId);

                var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
