package com.Laxman.BankingSystem.repository;

import com.Laxman.BankingSystem.entity.Account;
import com.Laxman.BankingSystem.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Long> {

    List<Account> findByUser(User user);

    Optional<Account> findByAccountNumber(String accountNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.accountNumber = :accountNumber")
    Optional<Account> findWithLockingByAccountNumber(
            @Param("accountNumber") String accountNumber);

    Boolean existsByAccountNumber(String accountNumber);

    Boolean existsByGovernmentId(String governmentId);
}
