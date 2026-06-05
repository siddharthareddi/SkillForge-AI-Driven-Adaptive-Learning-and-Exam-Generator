package com.skillforge.backend.repositories;

import com.skillforge.backend.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findById(String id);
}
