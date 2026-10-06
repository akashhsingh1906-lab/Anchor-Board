package com.saas.notification.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.UUID;

/**
 * Minimal JWT claim extraction, mirroring auth-service's signing key so the
 * same Bearer token that authenticates against auth-service/project-service
 * can identify a user here. notification-service has no
 * spring-boot-starter-security dependency, so this parses claims directly
 * rather than wiring a full SecurityFilterChain.
 */
@Component
public class JwtSupport {

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

    public record TokenUser(UUID userId, Long tenantId, String email) {
    }

    public TokenUser parse(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .requireIssuer(issuer)
                    .build()
                    .parseSignedClaims(authorizationHeader.substring(7))
                    .getPayload();

            return new TokenUser(
                    UUID.fromString(claims.getSubject()),
                    claims.get("tenantId", Long.class),
                    claims.get("email", String.class)
            );
        } catch (Exception e) {
            return null;
        }
    }
}
