package com.searchfilter.platform.repository;

import com.searchfilter.platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCategoryIgnoreCase(String category);
    List<Course> findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String courseName, String description);
    List<Course> findByCategoryIgnoreCaseAndCourseNameContainingIgnoreCase(String category, String courseName);
}
