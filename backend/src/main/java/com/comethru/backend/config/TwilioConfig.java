package com.comethru.backend.config;

import com.twilio.Twilio;
import com.comethru.backend.config.properties.TwilioProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class TwilioConfig {

    TwilioProperties twilioProps;

    @Autowired
    public TwilioConfig(TwilioProperties twilioProps) {
        this.twilioProps = twilioProps;
    }

    @PostConstruct
    public void initTwilio() {
        Twilio.init(twilioProps.accountSid(), twilioProps.authToken());
    }
}
