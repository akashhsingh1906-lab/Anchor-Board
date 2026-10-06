package com.saas.auth.config;

import com.saas.auth.entity.User;
import com.saas.auth.entity.UserRole;
import com.saas.auth.entity.UserStatus;
import com.saas.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a demo account on startup so the platform can be logged into and
 * exercised immediately, without requiring self-service registration first.
 */
@Component
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DemoDataSeeder.class);
    public static final long DEMO_TENANT_ID = 1L;
    public static final String DEMO_EMAIL = "demo@anchorboard.io";
    public static final String DEMO_PASSWORD = "Demo1234!";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmailAndTenantId(DEMO_EMAIL, DEMO_TENANT_ID)) {
            return;
        }

        User demoUser = new User(
                DEMO_EMAIL,
                passwordEncoder.encode(DEMO_PASSWORD),
                "Demo",
                "Admin",
                DEMO_TENANT_ID
        );
        demoUser.setRole(UserRole.ADMIN);
        demoUser.setUserStatus(UserStatus.ACTIVE);
        demoUser.setIsEmailVerified(true);
        userRepository.save(demoUser);

        logger.info("Seeded demo user {} for tenant {}", DEMO_EMAIL, DEMO_TENANT_ID);
    }
}
