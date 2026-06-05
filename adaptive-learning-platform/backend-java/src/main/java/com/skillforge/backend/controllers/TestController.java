package com.skillforge.backend.controllers;

import com.skillforge.backend.models.Question;
import com.skillforge.backend.models.User;
import com.skillforge.backend.payload.request.TestSubmitRequest;
import com.skillforge.backend.payload.response.MessageResponse;
import com.skillforge.backend.repositories.QuestionRepository;
import com.skillforge.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions(@RequestParam(required = false) String topicId) {
        if (topicId != null && !topicId.isEmpty()) {
            return ResponseEntity.ok(questionRepository.findByTopicId(topicId));
        }
        return ResponseEntity.ok(questionRepository.findAll());
    }

    @PostMapping("/questions")
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        Question saved = questionRepository.save(question);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTestProgress(@RequestBody TestSubmitRequest request) {
        String userId = request.getUserId();

        if ("u123".equals(userId)) {
            // Guest mode logic
            return ResponseEntity.ok(new MessageResponse("Progress recorded locally for guests."));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setAbility(request.getAbility());
        user.setTopicMastery(request.getTopicMastery());
        user.setAttempts(request.getAttempts());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }
}
