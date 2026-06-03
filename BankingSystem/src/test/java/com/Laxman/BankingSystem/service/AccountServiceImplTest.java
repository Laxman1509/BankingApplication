package com.Laxman.BankingSystem.service;

import com.Laxman.BankingSystem.entity.Account;
import com.Laxman.BankingSystem.entity.User;
import com.Laxman.BankingSystem.repository.AccountRepository;
import com.Laxman.BankingSystem.repository.TransactionRepository;
import com.Laxman.BankingSystem.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAccountByNumberRejectsAnotherUsersAccount() {
        User owner = user(1L, "owner@example.com");
        User loggedInUser = user(2L, "other@example.com");
        Account account = account(owner);
        authenticate(loggedInUser.getEmail());

        when(accountRepository.findByAccountNumber(account.getAccountNumber()))
                .thenReturn(Optional.of(account));
        when(userRepository.findByEmail(loggedInUser.getEmail()))
                .thenReturn(Optional.of(loggedInUser));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> accountService.getAccountByNumber(account.getAccountNumber()));

        assertEquals("Access denied: Not your account", ex.getMessage());
        verifyNoInteractions(transactionRepository);
    }

    @Test
    void getAccountByNumberMasksSensitiveKycFields() {
        User owner = user(1L, "owner@example.com");
        Account account = account(owner);
        authenticate(owner.getEmail());

        when(accountRepository.findByAccountNumber(account.getAccountNumber()))
                .thenReturn(Optional.of(account));
        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));

        var response = accountService.getAccountByNumber(account.getAccountNumber());

        assertNull(response.getDob());
        assertEquals("****6789", response.getGovernmentId());
    }

    private void authenticate(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null)
        );
    }

    private User user(Long id, String email) {
        return User.builder()
                .id(id)
                .firstName("Test")
                .lastName("User")
                .email(email)
                .password("encoded")
                .role(User.Role.USER)
                .build();
    }

    private Account account(User owner) {
        return Account.builder()
                .id(10L)
                .accountNumber("BNK2026123456")
                .accountType(Account.AccountType.SAVINGS)
                .balance(BigDecimal.TEN)
                .status(Account.AccountStatus.ACTIVE)
                .dob(LocalDate.of(2000, 1, 1))
                .governmentId("GOV123456789")
                .user(owner)
                .build();
    }
}
