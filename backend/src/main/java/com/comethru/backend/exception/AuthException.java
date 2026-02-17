package com.comethru.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends BaseException {

    private AuthException(String message, Throwable cause, ErrorCode errorCode, HttpStatus status) {
        super(message, cause, errorCode, status);
    }
}
