package com.saas.project.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Resolves user emails from auth-service so Kafka domain events (task
 * assigned, project created) carry a real recipient address instead of an
 * empty string — auth-service is the only service with the User table.
 */
@Component
public class UserDirectoryClient {

    private static final Logger logger = LoggerFactory.getLogger(UserDirectoryClient.class);

    private final RestTemplate restTemplate;

    @Value("${app.auth-service.url:http://auth-service:8081/auth}")
    private String authServiceUrl;

    public UserDirectoryClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Look up a user's email by ID, using the same JWT that authenticated
     * the current request (auth-service's /api/users just needs a valid
     * token, not a specific role).
     */
    public String resolveEmail(UUID userId, String bearerToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", bearerToken);
            var response = restTemplate.exchange(
                    authServiceUrl + "/api/users",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });

            List<Map<String, Object>> users = response.getBody();
            if (users == null) return "";

            return users.stream()
                    .filter(u -> userId.toString().equals(u.get("id")))
                    .map(u -> (String) u.get("email"))
                    .findFirst()
                    .orElse("");
        } catch (Exception e) {
            logger.warn("Could not resolve email for user {}: {}", userId, e.getMessage());
            return "";
        }
    }
}
