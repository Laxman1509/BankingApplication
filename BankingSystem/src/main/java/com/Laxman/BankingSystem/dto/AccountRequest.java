package com.Laxman.BankingSystem.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AccountRequest {

    @NotBlank(message = "Account type is required")
    @Pattern(
            regexp = "SAVINGS|CURRENT",
            message = "Account type must be SAVINGS or CURRENT"
    )
    private String accountType;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotBlank(message = "Government ID is required")
    @Size(min = 6, max = 20,
            message = "Government ID must be between 6 and 20 characters")
    private String governmentId;
}