package com.skillforge.backend.controllers;

import com.skillforge.backend.models.User;
import com.skillforge.backend.models.OTP;
import com.skillforge.backend.payload.request.*;
import com.skillforge.backend.payload.response.JwtResponse;
import com.skillforge.backend.payload.response.MessageResponse;
import com.skillforge.backend.repositories.UserRepository;
import com.skillforge.backend.repositories.OTPRepository;
import com.skillforge.backend.security.JwtUtil;
import com.skillforge.backend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    OTPRepository otpRepository;

    @Autowired
    EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid credentials"));
        }
        User user = userOpt.get();
        if (user.getPassword() == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Please sign in with Google"));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User already exists"));
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        // Auto-login after registration (simulate token generation)
        String jwt = jwtUtil.generateJwtToken(signUpRequest.getEmail(), user.getId(), user.getIsAdmin());
        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody GoogleLoginRequest request) {
        String email = request.getEmail();
        String name = request.getName();
        String googleId = request.getSub();

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setGoogleId(googleId);
            user = userRepository.save(user);
        }

        String jwt = jwtUtil.generateJwtToken(email, user.getId(), user.getIsAdmin());

        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        if (userRepository.findByEmail(email).isEmpty()) {
            // We don't reveal if user exists, just return success generically. 
            // Better security practice to prevent email enumeration.
            return ResponseEntity.ok(new MessageResponse("If an account with that email exists, an OTP has been sent."));
        }

        // Generate 6 digit OTP
        Random rnd = new Random();
        int number = rnd.nextInt(999999);
        String otpCode = String.format("%06d", number);

        // Delete any existing OTP for this user
        otpRepository.deleteByEmail(email);

        // Expire in 10 minutes
        Date expiresAt = new Date(System.currentTimeMillis() + 10 * 60 * 1000);
        OTP otp = new OTP(email, otpCode, expiresAt);
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);

        return ResponseEntity.ok(new MessageResponse("OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Optional<OTP> otpOpt = otpRepository.findByEmailAndOtpCode(request.getEmail(), request.getOtp());
        
        if (otpOpt.isEmpty() || otpOpt.get().getExpiresAt().before(new Date())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired OTP"));
        }

        return ResponseEntity.ok(new MessageResponse("OTP verified successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Verify OTP again just in case someone hits the endpoint directly
        Optional<OTP> otpOpt = otpRepository.findByEmailAndOtpCode(request.getEmail(), request.getOtp());
        if (otpOpt.isEmpty() || otpOpt.get().getExpiresAt().before(new Date())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired OTP"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        User user = userOpt.get();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Successfully reset, delete the OTP so it can't be used again
        otpRepository.deleteByEmail(request.getEmail());

        return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
    }
}
