package com.saas.auth.dto;

import com.saas.auth.entity.User;

import java.util.UUID;

/**
 * Full self-profile view, returned by /api/users/me — includes editable
 * fields that {@link UserSummary} (used for the team directory) omits.
 */
public class UserProfile {

    private final UUID id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String jobTitle;
    private final String avatarUrl;
    private final String role;

    public UserProfile(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.jobTitle = user.getJobTitle();
        this.avatarUrl = user.getAvatarUrl();
        this.role = user.getRole().name();
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getRole() {
        return role;
    }
}
