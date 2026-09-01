package com.expensetracker.service;

import org.springframework.stereotype.Service;

import com.expensetracker.dto.UserResponse;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // SAVE / SYNC FIREBASE USER
    // =========================

    public UserResponse saveFirebaseUser(
            String firebaseUid,
            String email,
            String name) {

        // First try to find the user using Firebase UID
        User user =
                userRepository.findByFirebaseUid(firebaseUid);

        // If user does not exist with Firebase UID,
        // check whether the email already exists.
        if (user == null) {
            user = userRepository.findByEmail(email);
        }

        // Create a new MySQL user if necessary
        if (user == null) {

            user = new User();

            user.setFirebaseUid(firebaseUid);
            user.setEmail(email);
            user.setName(name);

            // Firebase handles password authentication.
            // We do not store the Firebase password in MySQL.
            user.setPassword(null);

        } else {

            // Update existing user's Firebase information
            user.setFirebaseUid(firebaseUid);
            user.setEmail(email);
            user.setName(name);
        }

        User savedUser =
                userRepository.save(user);

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
    // GET USER BY FIREBASE UID
    // =========================

    public User getUserByFirebaseUid(
            String firebaseUid) {

        return userRepository.findByFirebaseUid(firebaseUid);
    }
}