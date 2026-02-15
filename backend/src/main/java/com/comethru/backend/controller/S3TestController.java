package com.comethru.backend.controller;

import com.comethru.backend.service.S3Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class S3TestController {

    private final S3Service s3Service;

    public S3TestController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/test-upload")
    public String uploadTestFile() {
        String bucketName = "images"; // Assumes 'images' bucket exists (MinIO default in chart)
        String key = "hello_world.txt";
        String content = "Hello World!";
        
        try {
            s3Service.uploadString(bucketName, key, content);
            return "Successfully uploaded " + key + " to bucket " + bucketName;
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }
}
