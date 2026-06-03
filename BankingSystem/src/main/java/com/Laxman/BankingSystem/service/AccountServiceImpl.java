package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.dto.AccountRequest;
import com.Laxman.BankingSystem.dto.AccountResponse;
import com.Laxman.BankingSystem.dto.TransactionRequest;
import com.Laxman.BankingSystem.dto.TransactionResponse;
import com.Laxman.BankingSystem.entity.Account;
import com.Laxman.BankingSystem.entity.Transaction;
import com.Laxman.BankingSystem.entity.User;
import com.Laxman.BankingSystem.repository.AccountRepository;
import com.Laxman.BankingSystem.repository.TransactionRepository;
import com.Laxman.BankingSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private static final Logger log =
            LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void verifyAccountOwner(Account account, User loggedInUser) {
        if (!account.getUser().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("Access denied: Not your account");
        }
    }

    private String generateAccountNumber() {
        int year = LocalDate.now().getYear();
        int randomDigits = (int) (Math.random() * 900000) + 100000;
        return "BNK" + year + randomDigits;
    }

    private String maskGovernmentId(String governmentId) {
        if (governmentId == null || governmentId.length() <= 4) {
            return "****";
        }
        return "****" + governmentId.substring(governmentId.length() - 4);
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .dob(null)
                .governmentId(maskGovernmentId(account.getGovernmentId()))
                .build();
    }

    @Override
    public AccountResponse createAccount(AccountRequest request) {

        User user = getLoggedInUser();

        if (accountRepository.existsByGovernmentId(request.getGovernmentId())) {
            throw new RuntimeException(
                    "Government ID already registered with another account!"
            );
        }

        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(Account.AccountType.valueOf(request.getAccountType()))
                .balance(BigDecimal.ZERO)
                .status(Account.AccountStatus.ACTIVE)
                .dob(request.getDob())
                .governmentId(request.getGovernmentId())
                .user(user)
                .build();

        accountRepository.save(account);
        log.info("Account created: {} for user: {}",
                account.getAccountNumber(), user.getEmail());

        return mapToResponse(account);
    }

    @Override
    public List<AccountResponse> getMyAccounts(String email) {

        log.info("Fetching accounts for: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AccountResponse getAccountByNumber(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyAccountOwner(account, getLoggedInUser());

        return mapToResponse(account);
    }

    @Transactional
    @Override
    public AccountResponse deposit(TransactionRequest request) {

        Account account = accountRepository
                .findWithLockingByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User loggedInUser = getLoggedInUser();
        verifyAccountOwner(account, loggedInUser);

        if (account.getStatus() == Account.AccountStatus.INACTIVE) {
            throw new RuntimeException(
                    "Account is blocked. Please contact admin.");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .type(Transaction.TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .account(account)
                .build();
        transactionRepository.save(transaction);

        log.info("Deposit of {} to account: {}",
                request.getAmount(), request.getAccountNumber());

        return mapToResponse(account);
    }

    @Transactional
    @Override
    public AccountResponse withdraw(TransactionRequest request) {

        Account account = accountRepository
                .findWithLockingByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User loggedInUser = getLoggedInUser();
        verifyAccountOwner(account, loggedInUser);

        if (account.getStatus() == Account.AccountStatus.INACTIVE) {
            throw new RuntimeException(
                    "Account is blocked. Please contact admin.");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(
                account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .type(Transaction.TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .account(account)
                .build();
        transactionRepository.save(transaction);

        log.info("Withdrawal of {} from account: {}",
                request.getAmount(), request.getAccountNumber());

        return mapToResponse(account);
    }

    @Override
    public List<TransactionResponse> getTransactions(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyAccountOwner(account, getLoggedInUser());

        return transactionRepository
                .findByAccountOrderByCreatedAtDesc(account)
                .stream()
                .map(tx -> TransactionResponse.builder()
                        .id(tx.getId())
                        .type(tx.getType().name())
                        .amount(tx.getAmount())
                        .balanceAfter(tx.getBalanceAfter())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .toList();
    }
}
