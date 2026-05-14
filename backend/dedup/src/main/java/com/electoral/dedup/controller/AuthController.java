package com.electoral.dedup.controller;

import com.electoral.dedup.dto.AuthDTOs.*;
import com.electoral.dedup.entity.Admin;
import com.electoral.dedup.entity.OTP;
import com.electoral.dedup.entity.Voter;
import com.electoral.dedup.repository.AdminRepository;
import com.electoral.dedup.repository.OTPRepository;
import com.electoral.dedup.repository.VoterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminRepository adminRepository;
    private final VoterRepository voterRepository;
    private final OTPRepository otpRepository;

    public AuthController(AdminRepository adminRepository,
            VoterRepository voterRepository,
            OTPRepository otpRepository) {
        this.adminRepository = adminRepository;
        this.voterRepository = voterRepository;
        this.otpRepository = otpRepository;
    }

    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(
            @RequestBody LoginRequest data) {

        if (!"admin".equals(data.getRole())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("detail", "Invalid role for admin login"));
        }

        Optional<Admin> adminOpt = adminRepository.findById(data.getUsername());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("detail", "Invalid admin ID."));
        }

        Admin admin = adminOpt.get();
        if (!admin.getPassword().equals(data.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("detail", "Invalid password."));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("role", "admin");
        response.put("admin_id", admin.getAdminId());
        response.put("admin_name", admin.getAdminName());
        response.put("branch_office", admin.getBranchOffice());
        response.put("branch_address", admin.getBranchAddress());
        response.put("designation", admin.getDesignation());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/login")
    public ResponseEntity<Map<String, Object>> userLogin(
            @RequestBody PhoneLoginRequest data) {

        String phone = data.getPhone().trim();
        if (phone.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("detail", "Phone number is required"));
        }

        Optional<Voter> voter = voterRepository.findByPhone(phone);
        String otpCode = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        OTP otp = new OTP();
        otp.setPhone(phone);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(expiresAt);
        otp.setVerified(false);
        otpRepository.save(otp);

        // NOTE: otp is returned in response for demo purposes only.
        // In production, remove "otp" from this response and send via SMS instead.
        Map<String, Object> response = new HashMap<>();
        response.put("status", "otp_sent");
        response.put("phone", phone);
        response.put("otp", otpCode);
        response.put("user_exists", voter.isPresent());
        response.put("message", voter.isPresent()
                ? "OTP sent to your phone number"
                : "OTP sent. Please register after verification.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @RequestBody OTPVerifyRequest data) {

        String phone = data.getPhone().trim();
        String otpInput = data.getOtp().trim();

        Optional<OTP> otpOpt = otpRepository.findById(phone);
        if (otpOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("detail", "OTP not found. Please request a new one."));
        }

        OTP otp = otpOpt.get();

        // Check expiry before checking the code
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otp);
            return ResponseEntity.badRequest()
                    .body(Map.of("detail", "OTP expired. Please request a new one."));
        }

        if (!otp.getOtpCode().equals(otpInput)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("detail", "Invalid OTP"));
        }

        otpRepository.delete(otp);

        Optional<Voter> voterOpt = voterRepository.findByPhone(phone);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "verified");

        if (voterOpt.isPresent()) {
            Voter voter = voterOpt.get();
            response.put("user_exists", true);
            response.put("voter_id", voter.getVoterId());
            response.put("name", voter.getName());
        } else {
            response.put("user_exists", false);
        }

        return ResponseEntity.ok(response);
    }
}
