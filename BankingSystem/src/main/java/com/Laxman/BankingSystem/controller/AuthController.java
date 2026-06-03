package com.Laxman.BankingSystem.controller;

import com.Laxman.BankingSystem.dto.AuthResponse;
import com.Laxman.BankingSystem.dto.LoginRequest;
import com.Laxman.BankingSystem.dto.RegisterRequest;
import com.Laxman.BankingSystem.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {  // ✅ @Valid added
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {     // ✅ @Valid added
        return ResponseEntity.ok(authService.login(request));
    }
}