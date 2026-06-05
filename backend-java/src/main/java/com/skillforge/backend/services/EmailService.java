package com.skillforge.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("support@skillforge.com");
        message.setTo(toEmail);
        message.setSubject("Your SkillForge Password Reset Code");
        message.setText("Hello,\n\nYour One-Time Password (OTP) for resetting your account is: " + otpCode + 
                        "\n\nThis code will expire in 10 minutes.\n\nIf you did not request a password reset, please ignore this email.");
        
        try {
            mailSender.send(message);
            System.out.println("OTP Email sent successfully to " + toEmail + ". CODE: [" + otpCode + "]"); // Useful for local dev if SMTP is bad
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ". " + e.getMessage());
            System.out.println("DEV FALLBACK - OTP for " + toEmail + " is: [" + otpCode + "]");
        }
    }
}
