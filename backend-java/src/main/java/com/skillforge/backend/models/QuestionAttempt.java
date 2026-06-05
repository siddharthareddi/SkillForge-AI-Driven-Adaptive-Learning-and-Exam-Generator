package com.skillforge.backend.models;

import java.util.Date;

public class QuestionAttempt {
    private String questionId;
    private Boolean isCorrect;
    private Date timestamp;
    private Double probability;
    private Double responseTime;
    private Double confidenceScore;

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }
    public Double getResponseTime() { return responseTime; }
    public void setResponseTime(Double responseTime) { this.responseTime = responseTime; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}
