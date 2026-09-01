package com.expensetracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.UserResponse;
import com.expensetracker.model.User;
import com.expensetracker.service.UserService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://expense-tracker-frontend-9pbz3l72n-akhila24.vercel.app",
    "https://expense-tracker-frontend-one-gamma.vercel.app",
    "https://expenseai-finance.vercel.app"
})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<?> saveFirebaseUser(
            @RequestBody User user) {

        try {

            UserResponse savedUser =
                    userService.saveFirebaseUser(
                            user.getFirebaseUid(),
                            user.getEmail(),
                            user.getName()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}