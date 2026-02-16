package com.comethru.backend.controller;

import com.comethru.backend.entity.User;
import com.comethru.backend.entity.dto.UserDto;
import com.comethru.backend.entity.rest.UpdateProfileRequest;
import com.comethru.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody User user) {
        User newUser = userService.createNew(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.fromUser(newUser));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(JwtAuthenticationToken token) {
        String phoneNumber = token.getToken().getSubject();
        User user = userService.findByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(UserDto.fromUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody UpdateProfileRequest req, JwtAuthenticationToken token) {
        String phoneNumber = token.getToken().getSubject();
        User body = userService.updateUserProfile(
                phoneNumber,
                req.firstName(),
                req.lastName(),
                req.profilePicUrl()
        );
        return ResponseEntity.ok(body);
    }
}
