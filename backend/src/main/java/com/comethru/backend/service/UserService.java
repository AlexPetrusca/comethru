package com.comethru.backend.service;

import com.comethru.backend.entity.User;
import com.comethru.backend.exception.ResourceNotFoundException;
import com.comethru.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public User create(String phoneNumber, String firstName, String lastName, String profilePicUrl) {
        User user = User.builder()
                .phoneNumber(phoneNumber)
                .firstName(firstName)
                .lastName(lastName)
                .profilePicUrl(profilePicUrl)
                .build();
        return userRepository.save(user);
    }

    public User findById(long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.user(userId));
    }

    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> ResourceNotFoundException.user(phoneNumber));
    }
}
