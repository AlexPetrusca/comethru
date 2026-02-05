package com.comethru.backend.controller;

import com.comethru.backend.entity.rest.SendOtpRequest;
import com.comethru.backend.entity.rest.VerifyOtpRequest;
import com.comethru.backend.service.CookieService;
import com.comethru.backend.service.JwtService;
import com.comethru.backend.service.otp.TwilioService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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
    private final CookieService cookieService;

    @Autowired
    public AuthController(TwilioService twilioService, JwtService jwtService, CookieService cookieService) {
        this.twilioService = twilioService;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @PostMapping("/send_otp")
    public ResponseEntity<Void> sendOtp(@RequestBody @Valid SendOtpRequest req) {
        twilioService.sendOtp(req.phoneNumber());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody @Valid VerifyOtpRequest req, HttpServletResponse response) {
        twilioService.verifyOtp(req.phoneNumber(), req.code());

        String jwt = jwtService.generateToken(req.phoneNumber(), List.of("ROLE_USER"));
        ResponseCookie authCookie = cookieService.getAuthCookie(jwt);

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
        return ResponseEntity.noContent().build();
    }

    // todo: This endpoint requires Authorization
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = cookieService.getEmptyAuthCookie();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}