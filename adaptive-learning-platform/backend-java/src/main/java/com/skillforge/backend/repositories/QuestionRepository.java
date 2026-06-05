package com.skillforge.backend.repositories;

import com.skillforge.backend.models.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends MongoRepository<Question, String> {
    Optional<Question> findById(String id);
    
    List<Question> findByTopicId(String topicId); // Find questions matching topic_id
}
