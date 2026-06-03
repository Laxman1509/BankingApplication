package com.Laxman.BankingSystem.controller;

import com.Laxman.BankingSystem.dto.AccountRequest;
import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.TransactionRequest;
import com.Laxman.BankingSystem.dto.TransactionResponse;
import com.Laxman.BankingSystem.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // Create Account
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody AccountRequest request) {      // ✅ @Valid added
        return ResponseEntity.ok(accountService.createAccount(request));
    }

    // Get My Accounts
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccounts() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return ResponseEntity.ok(accountService.getMyAccounts(email));
    }

    // Get Account By Number
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(
                accountService.getAccountByNumber(accountNumber));
    }

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<AccountResponse> deposit(
            @Valid @RequestBody TransactionRequest request) {  // ✅ @Valid added
        return ResponseEntity.ok(accountService.deposit(request));
    }

    // Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<AccountResponse> withdraw(
            @Valid @RequestBody TransactionRequest request) {  // ✅ @Valid added
        return ResponseEntity.ok(accountService.withdraw(request));
    }

    // Get Transactions (Passbook)
    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(  // ✅ DTO now
                                                                       @PathVariable String accountNumber) {
        return ResponseEntity.ok(
                accountService.getTransactions(accountNumber));
    }
}