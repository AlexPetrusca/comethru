package com.comethru.backend.service;

import com.comethru.backend.entity.User;
import com.comethru.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User createNew(User user) {
        // todo: dont throw runtime exceptions here
        //  - use your own exceptions
        //  - make it bad request
        if (userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already registered!");
        }
        return userRepository.save(user);
    }

    public User findById(long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).orElse(null);
    }

    public User updateUserProfile(String phoneNumber, String firstName, String lastName, String profilePicUrl) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        if (profilePicUrl != null) {
            user.setProfilePicUrl(profilePicUrl);
        }

        return userRepository.save(user);
    }
}
