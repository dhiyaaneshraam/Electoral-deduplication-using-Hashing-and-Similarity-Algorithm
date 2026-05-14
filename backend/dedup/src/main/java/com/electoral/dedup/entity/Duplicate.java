package com.electoral.dedup.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "duplicates")
public class Duplicate {

    @Id
    @Column(name = "duplicate_id")
    private String duplicateId;

    private String name;

    @Column(name = "father_name")
    private String fatherName;

    private String dob;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phone;
    private String aadhar;

    @Column(columnDefinition = "TEXT")
    private String photo;

    @Column(name = "matched_voter_id")
    private String matchedVoterId;

    @Column(name = "source_ip")
    private String sourceIp;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public String getDuplicateId() { return duplicateId; }
    public void setDuplicateId(String duplicateId) { this.duplicateId = duplicateId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
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
    public String getMatchedVoterId() { return matchedVoterId; }
    public void setMatchedVoterId(String matchedVoterId) { this.matchedVoterId = matchedVoterId; }
    public String getSourceIp() { return sourceIp; }
    public void setSourceIp(String sourceIp) { this.sourceIp = sourceIp; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}