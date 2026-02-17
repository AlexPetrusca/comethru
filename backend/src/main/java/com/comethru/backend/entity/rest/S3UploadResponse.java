package com.comethru.backend.entity.rest;

public record S3UploadResponse(
        String uploadUrl,
        String key
) {}