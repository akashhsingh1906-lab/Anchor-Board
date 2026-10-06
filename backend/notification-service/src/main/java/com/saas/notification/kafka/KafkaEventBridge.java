package com.saas.notification.kafka;

import com.saas.common.event.DomainEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Bridges the real cross-process transport (Kafka, published by
 * project-service) back onto the existing in-process
 * {@code ApplicationEventPublisher} pipeline that {@code EventConsumerService}
 * already listens to via {@code @EventListener} — so the notification
 * creation logic doesn't need to change, only how the event physically
 * arrives at this service.
 */
@Component
public class KafkaEventBridge {

    private static final Logger logger = LoggerFactory.getLogger(KafkaEventBridge.class);

    private final ObjectMapper objectMapper;
    private final ApplicationEventPublisher applicationEventPublisher;

    public KafkaEventBridge(ObjectMapper objectMapper, ApplicationEventPublisher applicationEventPublisher) {
        this.objectMapper = objectMapper;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @KafkaListener(topics = "domain-events", groupId = "notification-service")
    public void onDomainEvent(String payload) {
        try {
            DomainEvent event = objectMapper.readValue(payload, DomainEvent.class);
            logger.info("Received {} ({}) from Kafka", event.getRoutingKey(), event.getEventId());
            applicationEventPublisher.publishEvent(event);
        } catch (Exception e) {
            logger.error("Failed to process domain event payload: {}", e.getMessage(), e);
        }
    }
}
