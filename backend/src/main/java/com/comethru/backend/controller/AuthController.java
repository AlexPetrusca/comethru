package com.comethru.backend.controller;

import com.comethru.backend.entity.rest.SendOtpRequest;
import com.comethru.backend.entity.rest.VerifyOtpRequest;
import com.comethru.backend.service.JwtService;
import com.comethru.backend.service.otp.TwilioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final TwilioService twilioService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(TwilioService twilioService, JwtService jwtService) {
        this.twilioService = twilioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/send_otp")
    public ResponseEntity<Void> sendOtp(@RequestBody @Valid SendOtpRequest req) {
        twilioService.sendOtp(req.phoneNumber());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid VerifyOtpRequest req) {
        twilioService.verifyOtp(req.phoneNumber(), req.code());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                req.phoneNumber(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        return ResponseEntity.ok(jwtService.generateToken(authentication));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Logic to clear cookies or invalidate session
        // todo: implement
        return ResponseEntity.noContent().build();
    }
}