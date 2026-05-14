package com.electoral.dedup.controller;

import com.electoral.dedup.dto.UserInput;
import com.electoral.dedup.entity.Voter;
import com.electoral.dedup.repository.VerificationRepository;
import com.electoral.dedup.repository.VoterRepository;
import com.electoral.dedup.service.DeduplicationService;
import com.electoral.dedup.util.HashingUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class VoterController {

    private final DeduplicationService deduplicationService;
    private final VoterRepository voterRepository;
    private final VerificationRepository verificationRepository;

    public VoterController(DeduplicationService deduplicationService,
            VoterRepository voterRepository,
            VerificationRepository verificationRepository) {
        this.deduplicationService = deduplicationService;
        this.voterRepository = voterRepository;
        this.verificationRepository = verificationRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody UserInput data,
            HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        Map<String, Object> result =
                deduplicationService.processRegistration(data, clientIp);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status/{voterId}")
    public ResponseEntity<Map<String, Object>> getStatus(
            @PathVariable String voterId) {
        return voterRepository.findById(voterId)
                .map(v -> ResponseEntity.ok(Map.of(
                        "status", (Object) "registered",
                        "voter_id", v.getVoterId(),
                        "name", v.getName(),
                        "phone", v.getPhone(),
                        "created_at", v.getCreatedAt().toString())))
                .orElseGet(() -> verificationRepository.findById(voterId)
                        .map(ver -> ResponseEntity.ok(Map.of(
                                "status", (Object) "pending_verification",
                                "verification_id", ver.getVerificationId())))
                        .orElse(ResponseEntity.status(404)
                                .body(Map.of("status", "not_found"))));
    }

    @PutMapping("/update/{voterId}")
    public ResponseEntity<Map<String, Object>> updateVoter(
            @PathVariable String voterId,
            @RequestBody UserInput data) {
        return voterRepository.findById(voterId)
                .map(voter -> {
                    if (data.getAddress() != null) {
                        voter.setAddress(data.getAddress());
                        voter.setNormAddress(
                                HashingUtil.normalizeAddress(data.getAddress()));
                        voter.setAddressHash(
                                HashingUtil.sha256(voter.getNormAddress()));
                    }
                    if (data.getPhoto() != null) {
                        voter.setPhoto(data.getPhoto());
                        voter.setNormPhoto(
                                HashingUtil.normalizePhoto(data.getPhoto()));
                        voter.setPhotoHash(
                                HashingUtil.sha256(voter.getNormPhoto()));
                    }
                    Map<String, String> hashes = HashingUtil.hashVoterFields(
                            voter.getName(), voter.getFatherName(),
                            voter.getDob(), voter.getAddress(),
                            voter.getPhone(), voter.getAadhar(),
                            voter.getPhoto() != null ? voter.getPhoto() : "");
                    voter.setMasterHash(hashes.get("master_hash"));
                    voterRepository.save(voter);
                    return ResponseEntity.ok(Map.of(
                            "status", (Object) "updated",
                            "voter_id", voterId));
                })
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("status", "not_found")));
    }
}