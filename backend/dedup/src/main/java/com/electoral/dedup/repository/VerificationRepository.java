package com.electoral.dedup.repository;

import com.electoral.dedup.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, String> {
    List<Verification> findByResolved(boolean resolved);
}