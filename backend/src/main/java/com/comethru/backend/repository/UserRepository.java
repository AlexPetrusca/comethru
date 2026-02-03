package com.comethru.backend.repository;

import com.comethru.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Standard CRUD methods are automatically included
    Optional<User> findByPhoneNumber(String phoneNumber);
}