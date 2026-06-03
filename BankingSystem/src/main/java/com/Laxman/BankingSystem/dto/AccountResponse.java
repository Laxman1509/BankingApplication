package com.Laxman.BankingSystem.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class AccountResponse {
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;

    private LocalDate dob;
    private String governmentId;

    private String ownerName;
    private String ownerEmail;
}