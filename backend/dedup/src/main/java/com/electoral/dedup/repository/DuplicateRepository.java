package com.electoral.dedup.repository;

import com.electoral.dedup.entity.Duplicate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DuplicateRepository extends JpaRepository<Duplicate, String> {
}