package com.comethru.backend.service;

import com.comethru.backend.config.properties.SessionProperties;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final SessionProperties sessionProps;

    public JwtService(JwtEncoder encoder, SessionProperties sessionProps) {
        this.encoder = encoder;
        this.sessionProps = sessionProps;
    }

    public String generateToken(String phoneNumber, List<String> authorities) {
        Instant now = Instant.now();
        String scope = String.join(" ", authorities);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(sessionProps.duration()))
                .subject(phoneNumber)
                .claim("scope", scope)
                .build();

        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}