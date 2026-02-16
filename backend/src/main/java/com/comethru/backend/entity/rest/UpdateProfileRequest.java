package com.comethru.backend.entity.rest;

public record UpdateProfileRequest(
        String firstName,
        String lastName,
        String profilePicUrl
) {}
