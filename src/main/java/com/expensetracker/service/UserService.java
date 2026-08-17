package com.expensetracker.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.UserResponse;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER USER
    // =========================

    public UserResponse registerUser(User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new RuntimeException("Email already exists");
        }

        // Convert normal password into BCrypt password
        String encodedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName()
        );
    }


    // =========================
    // GET USER BY EMAIL
    // =========================

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    // =========================
    // LOGIN USER
    // =========================

    public UserResponse loginUser(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        // Compare entered password with BCrypt password
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName()
        );
    }
}