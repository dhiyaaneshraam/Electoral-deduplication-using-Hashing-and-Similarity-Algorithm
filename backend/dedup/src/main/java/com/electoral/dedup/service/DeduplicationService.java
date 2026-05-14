package com.electoral.dedup.service;

import com.electoral.dedup.dto.UserInput;
import com.electoral.dedup.entity.Duplicate;
import com.electoral.dedup.entity.Verification;
import com.electoral.dedup.entity.Voter;
import com.electoral.dedup.repository.DuplicateRepository;
import com.electoral.dedup.repository.VerificationRepository;
import com.electoral.dedup.repository.VoterRepository;
import com.electoral.dedup.util.HashingUtil;
import com.electoral.dedup.util.SimilarityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeduplicationService {

    private final VoterRepository voterRepository;
    private final VerificationRepository verificationRepository;
    private final DuplicateRepository duplicateRepository;

    // Spec says: similarity >= 80% → mark as "Similar Record"
    private static final double SIMILARITY_THRESHOLD = 0.80;

    public DeduplicationService(VoterRepository voterRepository,
            VerificationRepository verificationRepository,
            DuplicateRepository duplicateRepository) {
        this.voterRepository = voterRepository;
        this.verificationRepository = verificationRepository;
        this.duplicateRepository = duplicateRepository;
    }

    @Transactional
    public Map<String, Object> processRegistration(UserInput data, String sourceIp) {

        // ── Step 1: Normalize + hash all fields ───────────────────────────────
        Map<String, String> hashes = HashingUtil.hashVoterFields(
                data.getName(), data.getFatherName(), data.getDob(),
                data.getAddress(), data.getPhone(), data.getAadhar(),
                data.getPhoto() != null ? data.getPhoto() : "");

        // ── Step 2: Hard duplicate check ──────────────────────────────────────
        // Exact match on phone, aadhar, or SHA-512 master hash → "Duplicate Record"
        Optional<Voter> hardDup = voterRepository.findByPhone(data.getPhone())
                .or(() -> voterRepository.findByAadhar(data.getAadhar()))
                .or(() -> voterRepository.findByMasterHash(hashes.get("master_hash")));

        if (hardDup.isPresent()) {
            String duplicateId = UUID.randomUUID().toString();
            Duplicate duplicate = new Duplicate();
            duplicate.setDuplicateId(duplicateId);
            duplicate.setName(data.getName());
            duplicate.setFatherName(data.getFatherName());
            duplicate.setDob(data.getDob());
            duplicate.setAddress(data.getAddress());
            duplicate.setPhone(data.getPhone());
            duplicate.setAadhar(data.getAadhar());
            duplicate.setPhoto(data.getPhoto());
            duplicate.setMatchedVoterId(hardDup.get().getVoterId());
            duplicate.setSourceIp(sourceIp != null ? sourceIp : "");
            duplicateRepository.save(duplicate);

            // Output: "Duplicate Record"
            return Map.of(
                    "status", "duplicate",
                    "reason", "Duplicate Record: Voter identity already exists.",
                    "matched_voter_id", hardDup.get().getVoterId(),
                    "duplicate_id", duplicateId);
        }

        // ── Step 3: Similarity check ──────────────────────────────────────────
        // Compare name, address, DOB using Levenshtein + Jaccard + Hamming.
        // If composite score >= 80% → "Similar Record - Under Verification"
        Optional<Voter> similarVoter = findSimilarVoter(data, hashes);

        if (similarVoter.isPresent()) {
            String verificationId = "VER-" +
                    UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            Verification verification = new Verification();
            verification.setVerificationId(verificationId);
            verification.setVoterName(data.getName());
            verification.setFatherName(data.getFatherName());
            verification.setDob(data.getDob());
            verification.setAddress(data.getAddress());
            verification.setPhone(data.getPhone());
            verification.setAadhar(data.getAadhar());
            verification.setPhoto(data.getPhoto());
            verification.setSimilarToVoterId(similarVoter.get().getVoterId());
            verification.setSimilarFields("name, fatherName, dob, address");
            verification.setSimilarityScores("Composite score >= " + (int)(SIMILARITY_THRESHOLD * 100) + "%");
            verification.setResolved(false);
            verificationRepository.save(verification);

            // Output: "Similar Record - Under Verification"
            return Map.of(
                    "status", "verification_required",
                    "verification_id", verificationId,
                    "reason", "Similar Record - Under Verification: Forwarded for manual review.");
        }

        // ── Step 4: New unique record → store directly ────────────────────────
        Voter newVoter = new Voter();
        newVoter.setVoterId("VOT-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        newVoter.setName(data.getName());
        newVoter.setFatherName(data.getFatherName());
        newVoter.setDob(data.getDob());
        newVoter.setAddress(data.getAddress());
        newVoter.setPhone(data.getPhone());
        newVoter.setAadhar(data.getAadhar());
        newVoter.setPhoto(data.getPhoto());
        newVoter.setNormName(hashes.get("norm_name"));
        newVoter.setNormFatherName(hashes.get("norm_father_name"));
        newVoter.setNormDob(hashes.get("norm_dob"));
        newVoter.setNormAddress(hashes.get("norm_address"));
        newVoter.setNormPhone(hashes.get("norm_phone"));
        newVoter.setNormAadhar(hashes.get("norm_aadhar"));
        newVoter.setNormPhoto(hashes.get("norm_photo"));
        newVoter.setNameHash(hashes.get("name_hash"));
        newVoter.setFatherNameHash(hashes.get("father_name_hash"));
        newVoter.setDobHash(hashes.get("dob_hash"));
        newVoter.setAddressHash(hashes.get("address_hash"));
        newVoter.setPhoneHash(hashes.get("phone_hash"));
        newVoter.setAadharHash(hashes.get("aadhar_hash"));
        newVoter.setPhotoHash(hashes.get("photo_hash"));
        newVoter.setMasterHash(hashes.get("master_hash"));
        voterRepository.save(newVoter);

        // Output: "New Record Stored"
        return Map.of(
                "status", "accepted",
                "voter_id", newVoter.getVoterId(),
                "message", "New Record Stored: Registration successful!");
    }

    // ── Similarity scoring ────────────────────────────────────────────────────
    // Algorithms used per field (matching spec):
    //   Name        → Levenshtein          (weight 35%)
    //   Father Name → Levenshtein          (weight 25%)
    //   DOB         → exact match          (weight 20%)
    //   Address     → Levenshtein + Jaccard (weight 15%)
    //   Phone       → Hamming              (weight 5%)
    // Total = 100%

    private Optional<Voter> findSimilarVoter(UserInput input,
            Map<String, String> hashes) {

        List<Voter> candidates = voterRepository.findSimilarVoters(
                hashes.get("norm_dob"),
                hashes.get("norm_father_name"),
                hashes.get("norm_address"),
                hashes.get("photo_hash"));

        for (Voter existing : candidates) {
            double nameScore       = SimilarityUtil.nameSimilarity(input.getName(), existing.getName());
            double fatherNameScore = SimilarityUtil.fatherNameSimilarity(input.getFatherName(), existing.getFatherName());
            double dobScore        = SimilarityUtil.dobSimilarity(input.getDob(), existing.getDob());
            double addressScore    = SimilarityUtil.addressSimilarity(input.getAddress(), existing.getAddress());
            double phoneScore      = SimilarityUtil.phoneSimilarity(input.getPhone(), existing.getPhone());

            double compositeScore =
                (nameScore       * 0.35) +
                (fatherNameScore * 0.25) +
                (dobScore        * 0.20) +
                (addressScore    * 0.15) +
                (phoneScore      * 0.05);

            if (compositeScore >= SIMILARITY_THRESHOLD) {
                return Optional.of(existing);
            }
        }
        return Optional.empty();
    }
}