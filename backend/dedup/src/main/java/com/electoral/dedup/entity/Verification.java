package com.electoral.dedup.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
public class Verification {

    @Id
    @Column(name = "verification_id")
    private String verificationId;

    @Column(name = "voter_name")
    private String voterName;

    @Column(name = "father_name")
    private String fatherName;

    private String dob;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phone;
    private String aadhar;

    @Column(columnDefinition = "TEXT")
    private String photo;

    @Column(name = "similar_to_voter_id")
    private String similarToVoterId;

    @Column(name = "similar_fields")
    private String similarFields;

    @Column(name = "similarity_scores")
    private String similarityScores;

    private boolean resolved = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public String getVerificationId() { return verificationId; }
    public void setVerificationId(String verificationId) { this.verificationId = verificationId; }
    public String getVoterName() { return voterName; }
    public void setVoterName(String voterName) { this.voterName = voterName; }
    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAadhar() { return aadhar; }
    public void setAadhar(String aadhar) { this.aadhar = aadhar; }
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    public String getSimilarToVoterId() { return similarToVoterId; }
    public void setSimilarToVoterId(String similarToVoterId) { this.similarToVoterId = similarToVoterId; }
    public String getSimilarFields() { return similarFields; }
    public void setSimilarFields(String similarFields) { this.similarFields = similarFields; }
    public String getSimilarityScores() { return similarityScores; }
    public void setSimilarityScores(String similarityScores) { this.similarityScores = similarityScores; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}