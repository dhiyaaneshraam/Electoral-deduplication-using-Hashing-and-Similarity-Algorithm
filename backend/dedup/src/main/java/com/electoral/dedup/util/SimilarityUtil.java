package com.electoral.dedup.util;

import java.util.*;
import java.util.stream.Stream;

public class SimilarityUtil {

    // ── Levenshtein (edit distance ratio) ─────────────────────────────────────
    // Used for: name, fatherName
    // Measures how many single-character edits are needed to transform s1 → s2.
    // Score = 1 - (editDistance / maxLength). Range: 0.0 (no match) to 1.0 (exact).

    public static double ratio(String s1, String s2) {
        if (s1 == null && s2 == null) return 1.0;
        if (s1 == null || s2 == null) return 0.0;
        if (s1.equals(s2)) return 1.0;

        int editDistance = levenshteinDistance(s1, s2);
        int maxLength = Math.max(s1.length(), s2.length());
        if (maxLength == 0) return 1.0;
        return 1.0 - ((double) editDistance / maxLength);
    }

    private static int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(Math.min(
                            dp[i - 1][j] + 1,
                            dp[i][j - 1] + 1),
                            dp[i - 1][j - 1] + (s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1));
                }
            }
        }
        return dp[s1.length()][s2.length()];
    }

    // ── Jaccard similarity ────────────────────────────────────────────────────
    // Used for: address
    // Splits both strings into tokens, computes intersection / union of token sets.
    // Score = |A ∩ B| / |A ∪ B|. Range: 0.0 to 1.0.

    public static double jaccardSimilarity(String s1, String s2) {
        if (s1 == null && s2 == null) return 1.0;
        if (s1 == null || s2 == null) return 0.0;

        Set<String> tokensA = new HashSet<>(Arrays.asList(s1.split("[\\s_]+")));
        Set<String> tokensB = new HashSet<>(Arrays.asList(s2.split("[\\s_]+")));

        if (tokensA.isEmpty() && tokensB.isEmpty()) return 1.0;
        if (tokensA.isEmpty() || tokensB.isEmpty()) return 0.0;

        long intersection = tokensA.stream().filter(tokensB::contains).count();
        long union = Stream.concat(tokensA.stream(), tokensB.stream()).distinct().count();
        return (double) intersection / union;
    }

    // ── Hamming distance ──────────────────────────────────────────────────────
    // Used for: phone, aadhar (fixed-length digit strings)
    // Counts positions where the two strings differ.
    // Score = 1 - (differences / length). Range: 0.0 to 1.0.
    // If lengths differ, pads the shorter string with spaces before comparing.

    public static double hammingSimilarity(String s1, String s2) {
        if (s1 == null && s2 == null) return 1.0;
        if (s1 == null || s2 == null) return 0.0;
        if (s1.equals(s2)) return 1.0;

        int maxLen = Math.max(s1.length(), s2.length());
        if (maxLen == 0) return 1.0;

        // Pad shorter string so lengths match
        while (s1.length() < maxLen) s1 = s1 + " ";
        while (s2.length() < maxLen) s2 = s2 + " ";

        int differences = 0;
        for (int i = 0; i < maxLen; i++) {
            if (s1.charAt(i) != s2.charAt(i)) differences++;
        }
        return 1.0 - ((double) differences / maxLen);
    }

    // ── Per-field similarity methods ──────────────────────────────────────────

    // Name: Levenshtein on normalized name
    public static double nameSimilarity(String a, String b) {
        return ratio(HashingUtil.normalizeName(a), HashingUtil.normalizeName(b));
    }

    // Father name: Levenshtein on normalized father name
    public static double fatherNameSimilarity(String a, String b) {
        return ratio(HashingUtil.normalizeFatherName(a), HashingUtil.normalizeFatherName(b));
    }

    // DOB: exact match only (binary — same date or not)
    public static double dobSimilarity(String a, String b) {
        return HashingUtil.normalizeDob(a).equals(HashingUtil.normalizeDob(b)) ? 1.0 : 0.0;
    }

    // Address: combined Levenshtein + Jaccard (average of both)
    public static double addressSimilarity(String a, String b) {
        String na = HashingUtil.normalizeAddress(a);
        String nb = HashingUtil.normalizeAddress(b);
        double levenshteinScore = ratio(na, nb);
        double jaccardScore     = jaccardSimilarity(na, nb);
        return (levenshteinScore + jaccardScore) / 2.0;
    }

    // Phone: Hamming on digit-only phone strings
    public static double phoneSimilarity(String a, String b) {
        return hammingSimilarity(
                HashingUtil.normalizePhone(a),
                HashingUtil.normalizePhone(b));
    }

    // Aadhar: Hamming on digit-only aadhar strings
    public static double aadharSimilarity(String a, String b) {
        return hammingSimilarity(
                HashingUtil.normalizeAadhar(a),
                HashingUtil.normalizeAadhar(b));
    }

    // Photo: exact match only
    public static double photoSimilarity(String a, String b) {
        return HashingUtil.normalizePhoto(a).equals(HashingUtil.normalizePhoto(b)) ? 1.0 : 0.0;
    }
}