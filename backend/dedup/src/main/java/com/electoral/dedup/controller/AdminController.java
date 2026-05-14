package com.electoral.dedup.controller;

import com.electoral.dedup.entity.Duplicate;
import com.electoral.dedup.entity.Verification;
import com.electoral.dedup.entity.Voter;
import com.electoral.dedup.repository.DuplicateRepository;
import com.electoral.dedup.repository.VerificationRepository;
import com.electoral.dedup.repository.VoterRepository;
import com.electoral.dedup.util.HashingUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final VoterRepository voterRepository;
    private final VerificationRepository verificationRepository;
    private final DuplicateRepository duplicateRepository;

    public AdminController(VoterRepository voterRepository,
            VerificationRepository verificationRepository,
            DuplicateRepository duplicateRepository) {
        this.voterRepository = voterRepository;
        this.verificationRepository = verificationRepository;
        this.duplicateRepository = duplicateRepository;
    }

    @GetMapping("/voters")
    public List<Voter> getAllVoters() {
        return voterRepository.findAll();
    }

    @GetMapping("/verifications")
    public List<Verification> getPendingVerifications() {
        return verificationRepository.findByResolved(false);
    }

    @GetMapping("/duplicates")
    public List<Duplicate> getAllDuplicates() {
        return duplicateRepository.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_voters", voterRepository.count());
        stats.put("pending_verifications",
                verificationRepository.findByResolved(false).size());
        stats.put("total_duplicates", duplicateRepository.count());
        return stats;
    }

    @PatchMapping("/voters/{voterId}/block")
    public ResponseEntity<Map<String, Object>> blockVoter(
            @PathVariable String voterId) {
        return voterRepository.findById(voterId)
                .map(voter -> {
                    voter.setBlocked(true);
                    voterRepository.save(voter);
                    return ResponseEntity.ok(Map.of(
                            "status", (Object) "blocked",
                            "voter_id", voterId));
                })
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("status", "not_found")));
    }

    @DeleteMapping("/voters/{voterId}")
    public ResponseEntity<Void> deleteVoter(@PathVariable String voterId) {
        if (!voterRepository.existsById(voterId)) {
            return ResponseEntity.notFound().build();
        }
        voterRepository.deleteById(voterId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verification/resolve/{id}")
    public ResponseEntity<Map<String, Object>> resolveVerification(
            @PathVariable String id,
            @RequestParam boolean approve) {

        return verificationRepository.findById(id)
                .map(verification -> {
                    if (approve) {
                        Voter newVoter = new Voter();
                        newVoter.setVoterId("VOT-" +
                                UUID.randomUUID().toString()
                                        .substring(0, 8).toUpperCase());
                        newVoter.setName(verification.getVoterName());
                        newVoter.setFatherName(verification.getFatherName());
                        newVoter.setDob(verification.getDob());
                        newVoter.setAddress(verification.getAddress());
                        newVoter.setPhone(verification.getPhone());
                        newVoter.setAadhar(verification.getAadhar());
                        newVoter.setPhoto(verification.getPhoto());

                        Map<String, String> hashes = HashingUtil.hashVoterFields(
                                verification.getVoterName(),
                                verification.getFatherName(),
                                verification.getDob(),
                                verification.getAddress(),
                                verification.getPhone(),
                                verification.getAadhar(),
                                verification.getPhoto() != null
                                        ? verification.getPhoto() : "");

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
                        verification.setResolved(true);
                        verificationRepository.save(verification);

                        return ResponseEntity.ok(Map.of(
                                "status", (Object) "approved",
                                "voter_id", newVoter.getVoterId()));
                    } else {
                        Duplicate duplicate = new Duplicate();
                        duplicate.setDuplicateId(UUID.randomUUID().toString());
                        duplicate.setName(verification.getVoterName());
                        duplicate.setFatherName(verification.getFatherName());
                        duplicate.setDob(verification.getDob());
                        duplicate.setAddress(verification.getAddress());
                        duplicate.setPhone(verification.getPhone());
                        duplicate.setAadhar(verification.getAadhar());
                        duplicate.setPhoto(verification.getPhoto());
                        duplicate.setMatchedVoterId(
                                verification.getSimilarToVoterId());
                        duplicate.setSourceIp("admin-rejected");
                        duplicateRepository.save(duplicate);

                        verification.setResolved(true);
                        verificationRepository.save(verification);

                        return ResponseEntity.ok(Map.of(
                                "status", (Object) "rejected"));
                    }
                })
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("status", "not_found")));
    }
}