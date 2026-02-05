package com.comethru.backend.service.otp;

import com.comethru.backend.entity.types.OtpChannel;

public interface OtpService {

    void sendOtp(String phone, OtpChannel channel);

    void verifyOtp(String phone, String code);
}
