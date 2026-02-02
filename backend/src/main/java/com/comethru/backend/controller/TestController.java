package com.comethru.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/time")
    public Map<String, Object> getCurrentTime() {
        Map<String, Object> response = new HashMap<>();
        response.put("currentTime", LocalDateTime.now());
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}