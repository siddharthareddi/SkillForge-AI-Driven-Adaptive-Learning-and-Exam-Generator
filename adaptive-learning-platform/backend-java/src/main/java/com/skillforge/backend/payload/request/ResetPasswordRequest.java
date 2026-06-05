package com.skillforge.backend.payload.request;

public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String otp; // To verify they are authorized to reset

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
