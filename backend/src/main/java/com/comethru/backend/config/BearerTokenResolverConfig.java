package com.comethru.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class BearerTokenResolverConfig {
    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return (HttpServletRequest request) -> {
            // 1) Authorization header (standard)
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }

            // 2) Cookie fallback (AUTH_TOKEN)
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("AUTH_TOKEN".equals(cookie.getName())) {
                        String token = cookie.getValue();
                        if (StringUtils.hasText(token)) {
                            return token;
                        }
                        break;
                    }
                }
            }

            // 3) Query param fallback (for websocket)
            String param = request.getParameter("access_token");
            if (StringUtils.hasText(param)) {
                return param;
            }

            return null; // no token found
        };
    }
}

