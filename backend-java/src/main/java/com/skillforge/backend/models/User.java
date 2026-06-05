package com.skillforge.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String password;
    private String googleId;
    
    private Boolean isAdmin = false;
    private Double ability = 0.0;
    
    private Map<String, Double> topicMastery = new HashMap<>(Map.of(
            "logic", 0.5,
            "dsa", 0.3,
            "programming", 0.4
    ));
    
    private List<QuestionAttempt> attempts = new ArrayList<>();
    
    private List<String> enrolledCourses = new ArrayList<>();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
    public Double getAbility() { return ability; }
    public void setAbility(Double ability) { this.ability = ability; }
    public Map<String, Double> getTopicMastery() { return topicMastery; }
    public void setTopicMastery(Map<String, Double> topicMastery) { this.topicMastery = topicMastery; }
    public List<QuestionAttempt> getAttempts() { return attempts; }
    public void setAttempts(List<QuestionAttempt> attempts) { this.attempts = attempts; }
    public List<String> getEnrolledCourses() { return enrolledCourses; }
    public void setEnrolledCourses(List<String> enrolledCourses) { this.enrolledCourses = enrolledCourses; }
}
