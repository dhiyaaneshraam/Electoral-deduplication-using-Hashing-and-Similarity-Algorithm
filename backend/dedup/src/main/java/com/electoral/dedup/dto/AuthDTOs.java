package com.electoral.dedup.dto;

public class AuthDTOs {

    public static class LoginRequest {
        private String username;
        private String password;
        private String role;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class PhoneLoginRequest {
        private String phone;

        public PhoneLoginRequest() {}

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class OTPVerifyRequest {
        private String phone;
        private String otp;

        public OTPVerifyRequest() {}

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}