package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.dto.AccountRequest;
import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.TransactionRequest;
import com.Laxman.BankingSystem.dto.TransactionResponse;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(AccountRequest request);

    List<AccountResponse> getMyAccounts(String email);

    AccountResponse getAccountByNumber(String accountNumber);

    AccountResponse deposit(TransactionRequest request);

    AccountResponse withdraw(TransactionRequest request);

    // ✅ FIXED - Returns DTO instead of raw entity
    List<TransactionResponse> getTransactions(String accountNumber);
}