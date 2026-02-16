package com.comethru.backend.controller;

import com.comethru.backend.service.S3Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/upload-url")
    public S3UploadResponse getPresignedUploadUrl(@RequestParam String filename, @RequestParam String contentType) {
        String bucketName = "images";
        String key = "uploads/" + System.currentTimeMillis() + "_" + filename;
        
        // Generate presigned URL valid for 10 minutes
        String uploadUrl = s3Service.createPresignedUploadUrl(bucketName, key, Duration.ofMinutes(10));
        
        return new S3UploadResponse(uploadUrl, key);
    }

    public record S3UploadResponse(String uploadUrl, String key) {}
}
