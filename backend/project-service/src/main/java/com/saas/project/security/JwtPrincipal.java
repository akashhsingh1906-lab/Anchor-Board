package com.saas.project.security;

import java.util.UUID;

/**
 * Lightweight authenticated-user principal extracted from a validated JWT.
 * Exposes {@code getId()} so SpEL expressions like
 * {@code authentication.principal.id} in {@code @PreAuthorize} resolve.
 */
public class JwtPrincipal {

    private final UUID id;
    private final String email;
    private final Long tenantId;

    public JwtPrincipal(UUID id, String email, Long tenantId) {
        this.id = id;
        this.email = email;
        this.tenantId = tenantId;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Long getTenantId() {
        return tenantId;
    }
}
