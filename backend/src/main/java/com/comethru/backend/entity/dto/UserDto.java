package com.comethru.backend.entity.dto;

import com.comethru.backend.entity.User;

public record UserDto(
        Long userId,
        String phoneNumber,
        String firstName,
        String lastName,
        String profilePicUrl
) {
    public static UserDto fromUser(User user) {
        return new UserDto(
                user.getId(),
                user.getPhoneNumber(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePicUrl()
        );
    }
}