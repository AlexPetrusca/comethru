package com.comethru.backend.exception;

// 1xxx: Validation errors
// 2xxx: Authentication / Authorization
// 3xxx: Database / Infrastructure

public enum ErrorCode {
    // 1xxx: Client/User Side
    BAD_REQUEST(1000),
    INVALID_PHONE_NUMBER(1001),
    INVALID_OTP_CODE(1002),
    EXPIRED_OTP_CODE(1003),

    // 5xxx: Infrastructure/Provider Side
    SMS_PROVIDER_UNAVAILABLE(5001),
    SMS_PROVIDER_ERROR(5002);

    private final int errorCode;

    ErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}
