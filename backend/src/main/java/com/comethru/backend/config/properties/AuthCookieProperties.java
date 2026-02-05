package com.comethru.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.auth.cookie")
public record AuthCookieProperties(
    String name,
    boolean secure,
    String sameSite
) {}