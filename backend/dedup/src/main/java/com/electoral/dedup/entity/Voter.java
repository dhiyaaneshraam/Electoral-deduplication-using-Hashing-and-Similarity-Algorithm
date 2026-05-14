package com.electoral.dedup.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "voters")
public class Voter {

    @Id
    @Column(name = "voter_id")
    private String voterId;

    @Column(nullable = false)
    private String name;

    @Column(name = "father_name")
    private String fatherName;

    private String dob;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(unique = true, nullable = false)
    private String aadhar;

    @Column(columnDefinition = "TEXT")
    private String photo;

    @Column(name = "norm_name")
    private String normName;

    @Column(name = "norm_father_name")
    private String normFatherName;

    @Column(name = "norm_dob")
    private String normDob;

    @Column(name = "norm_address")
    private String normAddress;

    @Column(name = "norm_phone")
    private String normPhone;

    @Column(name = "norm_aadhar")
    private String normAadhar;

    @Column(name = "norm_photo")
    private String normPhoto;

    @Column(name = "name_hash")
    private String nameHash;

    @Column(name = "father_name_hash")
    private String fatherNameHash;

    @Column(name = "dob_hash")
    private String dobHash;

    @Column(name = "address_hash")
    private String addressHash;

    @Column(name = "phone_hash")
    private String phoneHash;

    @Column(name = "aadhar_hash")
    private String aadharHash;

    @Column(name = "photo_hash")
    private String photoHash;

    @Column(name = "master_hash")
    private String masterHash;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean blocked = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
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
    public String getNormName() { return normName; }
    public void setNormName(String normName) { this.normName = normName; }
    public String getNormFatherName() { return normFatherName; }
    public void setNormFatherName(String normFatherName) { this.normFatherName = normFatherName; }
    public String getNormDob() { return normDob; }
    public void setNormDob(String normDob) { this.normDob = normDob; }
    public String getNormAddress() { return normAddress; }
    public void setNormAddress(String normAddress) { this.normAddress = normAddress; }
    public String getNormPhone() { return normPhone; }
    public void setNormPhone(String normPhone) { this.normPhone = normPhone; }
    public String getNormAadhar() { return normAadhar; }
    public void setNormAadhar(String normAadhar) { this.normAadhar = normAadhar; }
    public String getNormPhoto() { return normPhoto; }
    public void setNormPhoto(String normPhoto) { this.normPhoto = normPhoto; }
    public String getNameHash() { return nameHash; }
    public void setNameHash(String nameHash) { this.nameHash = nameHash; }
    public String getFatherNameHash() { return fatherNameHash; }
    public void setFatherNameHash(String fatherNameHash) { this.fatherNameHash = fatherNameHash; }
    public String getDobHash() { return dobHash; }
    public void setDobHash(String dobHash) { this.dobHash = dobHash; }
    public String getAddressHash() { return addressHash; }
    public void setAddressHash(String addressHash) { this.addressHash = addressHash; }
    public String getPhoneHash() { return phoneHash; }
    public void setPhoneHash(String phoneHash) { this.phoneHash = phoneHash; }
    public String getAadharHash() { return aadharHash; }
    public void setAadharHash(String aadharHash) { this.aadharHash = aadharHash; }
    public String getPhotoHash() { return photoHash; }
    public void setPhotoHash(String photoHash) { this.photoHash = photoHash; }
    public String getMasterHash() { return masterHash; }
    public void setMasterHash(String masterHash) { this.masterHash = masterHash; }
    public boolean isBlocked() { return blocked; }
    public void setBlocked(boolean blocked) { this.blocked = blocked; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}