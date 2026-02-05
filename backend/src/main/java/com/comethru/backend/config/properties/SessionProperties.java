package com.comethru.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "security.auth.session")
public record SessionProperties (
        Duration duration
) {}
