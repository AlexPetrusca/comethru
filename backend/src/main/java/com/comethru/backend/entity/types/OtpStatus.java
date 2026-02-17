package com.comethru.backend.entity.types;

public enum OtpStatus {
    PENDING,   // Code sent, waiting for user
    APPROVED,  // Code verified successfully
    CANCELED,  // Verification was aborted
    EXPIRED    // 10-minute window passed
}
