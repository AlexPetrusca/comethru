package com.comethru.backend.service;

import io.awspring.cloud.s3.S3Template;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Service
public class S3Service {

    private final S3Template s3Template;

    public S3Service(S3Template s3Template) {
        this.s3Template = s3Template;
    }

    public void uploadString(String bucket, String key, String content) {
        s3Template.upload(bucket, key, new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
    }
}
