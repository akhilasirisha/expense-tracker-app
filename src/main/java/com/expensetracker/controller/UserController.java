package com.expensetracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.UserResponse;
import com.expensetracker.service.UserService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://expense-tracker-frontend-9pbz3l72n-akhila24.vercel.app",
    "https://expense-tracker-frontend-one-gamma.vercel.app"
})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/users")
    public ResponseEntity<?> registerUser(
            @RequestBody com.expensetracker.model.User user) {

        try {

            UserResponse newUser =
                    userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists!");
        }
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestParam String email,
            @RequestParam String password) {

        try {

            UserResponse user =
                    userService.loginUser(
                            email,
                            password
                    );

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password!");
        }
    }
}