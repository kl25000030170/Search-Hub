package com.searchfilter.platform.service;

import com.searchfilter.platform.dto.CourseDTO;
import com.searchfilter.platform.entity.Course;
import com.searchfilter.platform.exception.ResourceNotFoundException;
import com.searchfilter.platform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final SearchLogService searchLogService;

    @Autowired
    public CourseService(CourseRepository courseRepository, SearchLogService searchLogService) {
        this.courseRepository = courseRepository;
        this.searchLogService = searchLogService;
    }

    public List<CourseDTO> getAllCourses(String category, String search) {
        List<Course> courses;

        if (search != null && !search.trim().isEmpty()) {
            // Log the search query in the search logs
            searchLogService.createSearchLogFromQuery(search.trim());
        }

        if (category != null && !category.trim().isEmpty() && search != null && !search.trim().isEmpty()) {
            courses = courseRepository.findByCategoryIgnoreCaseAndCourseNameContainingIgnoreCase(category.trim(), search.trim());
        } else if (category != null && !category.trim().isEmpty()) {
            courses = courseRepository.findByCategoryIgnoreCase(category.trim());
        } else if (search != null && !search.trim().isEmpty()) {
            courses = courseRepository.findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search.trim(), search.trim());
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapToDTO(course);
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = mapToEntity(courseDTO);
        Course savedCourse = courseRepository.save(course);
        return mapToDTO(savedCourse);
    }

    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        existingCourse.setCourseName(courseDTO.getCourseName());
        existingCourse.setDescription(productCategoryFix(courseDTO.getDescription()));
        existingCourse.setDescription(courseDTO.getDescription());
        existingCourse.setDifficulty(courseDTO.getDifficulty());
        existingCourse.setCategory(courseDTO.getCategory());
        existingCourse.setImageUrl(courseDTO.getImageUrl());

        Course updatedCourse = courseRepository.save(existingCourse);
        return mapToDTO(updatedCourse);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    // Helper utility if needed (e.g. description sanitization)
    private String productCategoryFix(String input) {
        return input == null ? "" : input.trim();
    }

    // Helper methods for DTO-Entity mappings
    private CourseDTO mapToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .difficulty(course.getDifficulty())
                .category(course.getCategory())
                .imageUrl(course.getImageUrl())
                .build();
    }

    private Course mapToEntity(CourseDTO courseDTO) {
        return Course.builder()
                .id(courseDTO.getId())
                .courseName(courseDTO.getCourseName())
                .description(courseDTO.getDescription())
                .difficulty(courseDTO.getDifficulty())
                .category(courseDTO.getCategory())
                .imageUrl(courseDTO.getImageUrl())
                .build();
    }
}
