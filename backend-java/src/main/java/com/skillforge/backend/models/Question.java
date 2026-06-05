package com.skillforge.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "questions")
public class Question {
    @org.springframework.data.annotation.Id
    private String _id;
    private String id;
    
    @Field("topic_id")
    private String topicId;
    private Double difficulty;
    private Double discrimination;
    private String question;
    private List<String> options;
    private String correct;
    private List<String> tags;

    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public Double getDifficulty() { return difficulty; }
    public void setDifficulty(Double difficulty) { this.difficulty = difficulty; }
    public Double getDiscrimination() { return discrimination; }
    public void setDiscrimination(Double discrimination) { this.discrimination = discrimination; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public String getCorrect() { return correct; }
    public void setCorrect(String correct) { this.correct = correct; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
