package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.dto.AuthResponse;
import com.Laxman.BankingSystem.dto.LoginRequest;
import com.Laxman.BankingSystem.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}