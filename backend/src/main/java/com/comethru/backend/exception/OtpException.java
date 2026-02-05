package com.comethru.backend.exception;

import org.springframework.http.HttpStatus;

public class OtpException extends BaseException {

    private OtpException(String message, Throwable cause, ErrorCode errorCode, HttpStatus status) {
        super(message, cause, errorCode, status);
    }

    public static OtpException providerUnavailable(String message, Throwable cause) {
        return new OtpException(message, cause, ErrorCode.SMS_PROVIDER_UNAVAILABLE, HttpStatus.BAD_GATEWAY);
    }

    public static OtpException providerError(String message) {
        return new OtpException(message, null, ErrorCode.SMS_PROVIDER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static OtpException userError(String message, ErrorCode errorCode) {
        return new OtpException(message, null, errorCode, HttpStatus.BAD_REQUEST);
    }
}
