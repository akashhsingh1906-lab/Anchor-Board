package com.saas.project.event;

import com.saas.common.event.DomainEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Publishes domain events onto the shared Kafka topic so notification-service
 * (a separate process) can react to them. project-service and
 * notification-service each run in their own JVM, so Spring's in-memory
 * {@code ApplicationEventPublisher} cannot cross that boundary on its own -
 * Kafka is the actual transport between the two.
 */
@Service
public class KafkaDomainEventPublisher {

    private static final Logger logger = LoggerFactory.getLogger(KafkaDomainEventPublisher.class);
    public static final String TOPIC = "domain-events";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaDomainEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(DomainEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, event.getRoutingKey(), json);
            logger.info("Published {} ({}) to Kafka topic {}", event.getRoutingKey(), event.getEventId(), TOPIC);
        } catch (Exception e) {
            logger.error("Failed to publish domain event {}: {}", event.getRoutingKey(), e.getMessage(), e);
        }
    }
}
