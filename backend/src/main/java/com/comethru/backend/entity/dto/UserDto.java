package com.comethru.backend.entity.dto;

import com.comethru.backend.entity.User;

public record UserDto(
        Long userId,
        String phone,
        String firstName,
        String lastName
) {
    public static UserDto fromUser(User user) {
        return new UserDto(user.getId(), user.getPhoneNumber(), user.getFirstName(), user.getLastName());
    }
}