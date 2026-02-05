package com.comethru.backend.service.otp;

import com.comethru.backend.config.properties.TwilioProperties;
import com.comethru.backend.entity.types.OtpChannel;
import com.comethru.backend.entity.types.OtpStatus;
import com.comethru.backend.exception.ErrorCode;
import com.comethru.backend.exception.OtpException;
import com.twilio.exception.ApiException;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.stereotype.Service;

@Service
public class TwilioService implements OtpService {

    private final TwilioProperties twilioConfig;

    public TwilioService(TwilioProperties twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    public void sendOtp(String phoneNumber) {
        sendOtp(phoneNumber, OtpChannel.SMS);
    }

    @Override
    public void sendOtp(String phoneNumber, OtpChannel channel) {
        try {
            Verification verification = Verification.creator(twilioConfig.serviceSid(), phoneNumber, translateChannel(channel)).create();
            if (!verification.getStatus().equals(translateStatus(OtpStatus.PENDING))) {
                throw OtpException.providerError("Unexpected verification status: " + verification.getStatus());
            }
        } catch (ApiException e) {
            throw OtpException.providerUnavailable("SMS delivery failed due to a provider error.", e);
        }
    }

    public void verifyOtp(String phoneNumber, String code) {
        try {
            VerificationCheck verificationCheck = VerificationCheck.creator(twilioConfig.serviceSid())
                    .setTo(phoneNumber)
                    .setCode(code)
                    .create();
            if (!verificationCheck.getStatus().equals(translateStatus(OtpStatus.APPROVED))) {
                // todo: error code is wrong here
                throw OtpException.userError("The code provided is incorrect or has expired.", ErrorCode.INVALID_OTP_CODE);
            }
        } catch (ApiException e) {
            throw OtpException.providerUnavailable("OTP code verification failed due to a provider error.", e);
        }
    }

    public String translateChannel(OtpChannel c) {
        return switch (c) {
            case SMS -> "sms";
            case CALL -> "call";
            case WHATSAPP -> "whatsapp";
            case EMAIL -> "email";
        };
    }

    public String translateStatus(OtpStatus s) {
        return switch (s) {
            case PENDING -> "pending";
            case APPROVED -> "approved";
            case CANCELED -> "cancelled";
            case EXPIRED -> "expired";
        };
    }
}
