package com.Laxman.BankingSystem.controller;

import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.UserResponse;
import com.Laxman.BankingSystem.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testAdmin() {
        return ResponseEntity.ok("Admin access granted ✅");
    }

    // Get All Users
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Get All Accounts
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

     @PutMapping("/block/account/{accountNumber}")
    public ResponseEntity<String> blockAccount(
            @PathVariable String accountNumber) {
        adminService.blockAccount(accountNumber);
        return ResponseEntity.ok("Account blocked successfully");
    }

     @PutMapping("/unblock/account/{accountNumber}")
    public ResponseEntity<String> unblockAccount(
            @PathVariable String accountNumber) {
        adminService.unblockAccount(accountNumber);
        return ResponseEntity.ok("Account unblocked successfully");
    }
}