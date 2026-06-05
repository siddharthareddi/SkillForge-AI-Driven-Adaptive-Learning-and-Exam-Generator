package com.skillforge.backend.repositories;

import com.skillforge.backend.models.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OTPRepository extends MongoRepository<OTP, String> {
    Optional<OTP> findByEmailAndOtpCode(String email, String otpCode);
    void deleteByEmail(String email); // To clear old OTPs
}
