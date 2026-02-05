package com.comethru.backend.service;

import com.comethru.backend.config.properties.AuthCookieProperties;
import com.comethru.backend.config.properties.SessionProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    private final AuthCookieProperties authCookieProps;
    private final SessionProperties sessionProps;

    @Autowired
    public CookieService(AuthCookieProperties authCookieProps, SessionProperties sessionProps) {
        this.authCookieProps = authCookieProps;
        this.sessionProps = sessionProps;
    }

    public ResponseCookie getAuthCookie(String jwt) {
        return ResponseCookie.from(authCookieProps.name(), jwt)
                .httpOnly(true)
                .secure(authCookieProps.secure())
                .sameSite(authCookieProps.sameSite())
                .maxAge(sessionProps.duration())
                .path("/")
                .build();
    }

    public ResponseCookie getEmptyAuthCookie() {
        return ResponseCookie.from(authCookieProps.name(), "")
                .maxAge(0)
                .path("/")
                .build();
    }
}
