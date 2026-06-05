package com.skillforge.backend.payload.request;

import com.skillforge.backend.models.QuestionAttempt;

import java.util.List;
import java.util.Map;

public class TestSubmitRequest {
    private String userId;
    private Double ability;
    private Map<String, Double> topicMastery;
    private List<QuestionAttempt> attempts;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Double getAbility() { return ability; }
    public void setAbility(Double ability) { this.ability = ability; }
    public Map<String, Double> getTopicMastery() { return topicMastery; }
    public void setTopicMastery(Map<String, Double> topicMastery) { this.topicMastery = topicMastery; }
    public List<QuestionAttempt> getAttempts() { return attempts; }
    public void setAttempts(List<QuestionAttempt> attempts) { this.attempts = attempts; }
}
