package com.saas.auth.dto;

import com.saas.auth.entity.User;

import java.util.UUID;

/**
 * Minimal user info safe to expose to other tenant members — no password
 * hash or other sensitive fields, unlike the full {@link User} entity.
 */
public class UserSummary {

    private final UUID id;
    private final String displayName;
    private final String email;
    private final String role;

    public UserSummary(User user) {
        this.id = user.getId();
        this.displayName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public UUID getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
