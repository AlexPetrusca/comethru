package com.comethru.backend.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 1xxx: Validation / Not Found
    BAD_REQUEST(1000),
    RESOURCE_NOT_FOUND(1000),
    INVALID_PHONE_NUMBER(1002),

    // 2xxx: Authentication / Authorization
    AUTHORIZATION_ERROR(2000),
    INVALID_OTP_CODE(2001),
    EXPIRED_OTP_CODE(2002),

    // 3xxx: Database / Infrastructure / Providers
    INTERNAL_SERVER_ERROR(5000),
    SMS_PROVIDER_UNAVAILABLE(5001),
    SMS_PROVIDER_ERROR(5002);

    private final int errorCode;

    ErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }
}
