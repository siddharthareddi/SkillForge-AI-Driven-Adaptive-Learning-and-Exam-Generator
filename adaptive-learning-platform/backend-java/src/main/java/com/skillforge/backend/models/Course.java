package com.skillforge.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "courses")
public class Course {
    @org.springframework.data.annotation.Id
    private String _id;
    private String id; // Original string IDs from mockDatabase
    private String title;
    private String category;
    private String difficulty;
    private String duration;
    private Double rating = 0.0;
    private Integer students = 0;
    private String description;
    private List<String> topics;
    private List<String> tags;

    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getStudents() { return students; }
    public void setStudents(Integer students) { this.students = students; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
