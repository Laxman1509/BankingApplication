package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.UserResponse;

import java.util.List;

public interface AdminService {

    List<UserResponse> getAllUsers();

    List<AccountResponse> getAllAccounts();

    // ✅ FIXED - Block/unblock ACCOUNT not user
    void blockAccount(String accountNumber);

    void unblockAccount(String accountNumber);
}