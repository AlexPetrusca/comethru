package com.comethru.backend.service;

import com.comethru.backend.entity.User;
import com.comethru.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createNewUser(User user) {
        // todo: dont throw runtime exceptions here
        //  - use your own exceptions
        //  - make it bad request
        if (userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already registered!");
        }
        if (user.getFirstName() == null) {
            throw new RuntimeException("First name cannot be empty!");
        }
        if (user.getLastName() == null) {
            throw new RuntimeException("Last name cannot be empty!");
        }
        return userRepository.save(user);
    }
}
