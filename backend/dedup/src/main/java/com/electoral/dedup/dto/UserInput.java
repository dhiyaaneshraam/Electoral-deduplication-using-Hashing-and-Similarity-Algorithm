package com.electoral.dedup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class UserInput {

    @NotBlank(message = "Name is required")
    private String name;

    @JsonProperty("fatherName")
    @NotBlank(message = "Father's name is required")
    private String fatherName;

    @NotBlank(message = "Date of Birth is required")
    private String dob;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Aadhar number is required")
    private String aadhar;

    private String photo;

    public UserInput() {}

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
}