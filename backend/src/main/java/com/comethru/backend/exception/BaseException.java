package com.comethru.backend.exception;

import org.springframework.http.HttpStatus;

public abstract class BaseException extends RuntimeException {
    private final ErrorCode errorCode;
    private final HttpStatus status;

    protected BaseException(String message, Throwable cause, ErrorCode errorCode, HttpStatus status) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = status;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
