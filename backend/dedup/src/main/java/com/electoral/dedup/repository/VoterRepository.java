package com.electoral.dedup.repository;

import com.electoral.dedup.entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoterRepository extends JpaRepository<Voter, String> {

    Optional<Voter> findByPhone(String phone);
    Optional<Voter> findByAadhar(String aadhar);
    Optional<Voter> findByMasterHash(String masterHash);

    // Candidate query for near-duplicate detection:
    // DOB must match AND at least one of (fatherName, address, photo) must match.
    // This ensures only genuinely close records are pulled for similarity scoring.
    // Completely different people with a different DOB are never candidates.
    @Query("SELECT v FROM Voter v WHERE " +
            "v.normDob = :dob AND (" +
            "v.normFatherName = :father OR " +
            "v.normAddress = :address OR " +
            "v.photoHash = :photo)")
    List<Voter> findSimilarVoters(
            @Param("dob") String dob,
            @Param("father") String father,
            @Param("address") String address,
            @Param("photo") String photo);
}