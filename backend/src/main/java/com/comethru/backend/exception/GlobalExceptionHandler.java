package com.comethru.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<Map<String, Object>> handleBaseException(BaseException ex) {
        ex.printStackTrace(); // todo: true

        // todo: replace Map<String, Object> with a rest entity instead
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("code", ex.getErrorCode());
        body.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(body, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> Map.of("field", f.getField(), "msg", f.getDefaultMessage()))
                .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation failed");
        body.put("code", ErrorCode.BAD_REQUEST);
        body.put("timestamp", LocalDateTime.now());
        body.put("details", fieldErrors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}

// Example error response:
//    {
//      "message": "Validation failed",
//      "code": 1000,
//      "timestamp": "2026-02-05T12:00:00",
//      "details": [
//        {
//          "field": "phoneNumber",
//          "msg": "Invalid phone format",
//          "code": 1001
//        },
//        {
//          "field": "otpCode",
//          "msg": "Must be 6 digits",
//          "code": 1002
//        }
//      ]
//    }
