package com.comethru.backend.config;

import com.comethru.backend.config.properties.RsaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
public class RsaKeyConfig {

    RsaProperties rsaProps;

    public RsaKeyConfig(RsaProperties rsaProps) {
        this.rsaProps = rsaProps;
    }

    @Bean
    public RSAPublicKey rsaPublicKey() throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(rsaProps.publicKey());
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    @Bean
    public RSAPrivateKey rsaPrivateKey() throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(rsaProps.privateKey());
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
    }
}
