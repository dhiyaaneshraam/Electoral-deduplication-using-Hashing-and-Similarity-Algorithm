package com.electoral.dedup.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class HashingUtil {

    // ── Normalization ──────────────────────────────────────────────────────────

    public static String normalizeWhitespace(String value) {
        if (value == null) return "";
        return value.trim().toLowerCase().replaceAll("\\s+", "_");
    }

    public static String normalizeName(String name) {
        return normalizeWhitespace(name).toLowerCase();
    }

    public static String normalizeFatherName(String fatherName) {
        return normalizeWhitespace(fatherName).toLowerCase();
    }

    public static String normalizeDob(String dob) {
        if (dob == null || dob.isEmpty()) return "";
        return dob.trim().replace("/", "-").replace(".", "-");
    }

    public static String normalizeAddress(String address) {
        if (address == null) return "";
        String cleanAddress = address.replaceAll("[,.\\-]", " ");
        return normalizeWhitespace(cleanAddress).toLowerCase();
    }

    public static String normalizePhone(String phone) {
        if (phone == null) return "";
        return phone.replaceAll("\\D+", "");
    }

    public static String normalizeAadhar(String aadhar) {
        if (aadhar == null) return "";
        return aadhar.replaceAll("\\D+", "");
    }

    public static String normalizePhoto(String photo) {
        if (photo == null) return "";
        return photo.trim();
    }

    // ── Hashing ───────────────────────────────────────────────────────────────

    public static String sha256(String value) {
        return hash(value, "SHA-256");
    }

    public static String sha512(String value) {
        return hash(value, "SHA-512");
    }

    private static String hash(String value, String algorithm) {
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] encodedHash = digest.digest(
                value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing value", e);
        }
    }

    // ── Field hashing + master hash ───────────────────────────────────────────

    public static Map<String, String> hashVoterFields(
            String name, String fatherName, String dob, String address,
            String phone, String aadhar, String photo) {

        // Step 1 — normalize each field
        String normName       = normalizeName(name);
        String normFatherName = normalizeFatherName(fatherName);
        String normDob        = normalizeDob(dob);
        String normAddress    = normalizeAddress(address);
        String normPhone      = normalizePhone(phone);
        String normAadhar     = normalizeAadhar(aadhar);
        String normPhoto      = normalizePhoto(photo);

        // Step 2 — SHA-256 hash each individual field
        String nameHash       = sha256(normName);
        String fatherNameHash = sha256(normFatherName);
        String dobHash        = sha256(normDob);
        String addressHash    = sha256(normAddress);
        String phoneHash      = sha256(normPhone);
        String aadharHash     = sha256(normAadhar);
        String photoHash      = sha256(normPhoto);

        // Step 3 — combine all field hashes into one string
        String combined = Stream.of(
                nameHash, fatherNameHash, dobHash, addressHash,
                phoneHash, aadharHash, photoHash
        ).collect(Collectors.joining("|"));

        // Step 4 — generate master hash using SHA-512 (as per spec)
        String masterHash = sha512(combined);

        Map<String, String> result = new HashMap<>();
        result.put("norm_name",        normName);
        result.put("norm_father_name", normFatherName);
        result.put("norm_dob",         normDob);
        result.put("norm_address",     normAddress);
        result.put("norm_phone",       normPhone);
        result.put("norm_aadhar",      normAadhar);
        result.put("norm_photo",       normPhoto);
        result.put("name_hash",        nameHash);
        result.put("father_name_hash", fatherNameHash);
        result.put("dob_hash",         dobHash);
        result.put("address_hash",     addressHash);
        result.put("phone_hash",       phoneHash);
        result.put("aadhar_hash",      aadharHash);
        result.put("photo_hash",       photoHash);
        result.put("master_hash",      masterHash);

        return result;
    }
}