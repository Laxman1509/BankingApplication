package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.UserResponse;
import com.Laxman.BankingSystem.entity.Account;
import com.Laxman.BankingSystem.repository.AccountRepository;
import com.Laxman.BankingSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    // ─────────────────────────────────────────
    // Get All Users
    // ─────────────────────────────────────────
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .enabled(user.isEnabled())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();
    }

    // ─────────────────────────────────────────
    // Get All Accounts
    // ✅ FIXED - Added @Transactional to fix LazyInitializationException
    // ─────────────────────────────────────────
    @Transactional
    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(acc -> AccountResponse.builder()
                        .accountNumber(acc.getAccountNumber())
                        .accountType(acc.getAccountType().name())
                        .balance(acc.getBalance())
                        .status(acc.getStatus().name())
                        .ownerName(acc.getUser().getFirstName()
                                + " " + acc.getUser().getLastName())
                        .ownerEmail(acc.getUser().getEmail())
                        .build())
                .toList();
    }

    // ─────────────────────────────────────────
    // Block Account
    // ─────────────────────────────────────────
    @Override
    public void blockAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        if (account.getStatus() == Account.AccountStatus.INACTIVE) {
            throw new RuntimeException("Account is already blocked");
        }

        account.setStatus(Account.AccountStatus.INACTIVE);
        accountRepository.save(account);
    }

    // ─────────────────────────────────────────
    // Unblock Account
    // ─────────────────────────────────────────
    @Override
    public void unblockAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        if (account.getStatus() == Account.AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is already active");
        }

        account.setStatus(Account.AccountStatus.ACTIVE);
        accountRepository.save(account);
    }
}