package com.comethru.backend.service;

import io.awspring.cloud.s3.S3Template;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;
    private final S3Template s3Template;

    public S3Service(S3Template s3Template, S3Presigner s3Presigner) {
        this.s3Template = s3Template;
        this.s3Presigner = s3Presigner;
    }

    public void uploadString(String bucket, String key, String content) {
        s3Template.upload(bucket, key, new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
    }

    public String createPresignedUploadUrl(String bucket, String key, Duration duration) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest -> presignRequest
                .signatureDuration(duration)
                .putObjectRequest(objectRequest));

        return presignedRequest.url().toString();
    }
}
