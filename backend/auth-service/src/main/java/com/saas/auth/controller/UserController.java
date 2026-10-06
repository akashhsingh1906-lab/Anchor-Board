package com.saas.auth.controller;

import com.saas.auth.dto.PasswordChangeRequest;
import com.saas.auth.dto.ProfileUpdateRequest;
import com.saas.auth.dto.UserProfile;
import com.saas.auth.dto.UserSummary;
import com.saas.auth.entity.User;
import com.saas.auth.repository.UserRepository;
import com.saas.auth.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Exposes the tenant's user directory (for task assignment) and the
 * self-service profile/password endpoints used by Settings.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    private String bearerOrNull(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }

    @GetMapping
    public ResponseEntity<List<UserSummary>> listUsers(HttpServletRequest request) {
        String token = bearerOrNull(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long tenantId = tokenProvider.getTenantIdFromToken(token);

        List<UserSummary> users = userRepository.findByTenantId(tenantId).stream()
                .map(UserSummary::new)
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getMyProfile(HttpServletRequest request) {
        String token = bearerOrNull(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UUID userId = tokenProvider.getUserIdFromToken(token);
        return userRepository.findById(userId)
                .map(u -> ResponseEntity.ok(new UserProfile(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfile> updateMyProfile(@Valid @RequestBody ProfileUpdateRequest body, HttpServletRequest request) {
        String token = bearerOrNull(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UUID userId = tokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.getFirstName() != null && !body.getFirstName().isBlank()) {
            user.setFirstName(body.getFirstName());
        }
        if (body.getLastName() != null && !body.getLastName().isBlank()) {
            user.setLastName(body.getLastName());
        }
        if (body.getJobTitle() != null) {
            user.setJobTitle(body.getJobTitle());
        }
        if (body.getAvatarUrl() != null) {
            user.setAvatarUrl(body.getAvatarUrl());
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(new UserProfile(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody PasswordChangeRequest body, HttpServletRequest request) {
        String token = bearerOrNull(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UUID userId = tokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (!passwordEncoder.matches(body.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Current password is incorrect"));
        }

        user.setPasswordHash(passwordEncoder.encode(body.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
