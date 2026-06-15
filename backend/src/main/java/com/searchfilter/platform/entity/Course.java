package com.searchfilter.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    // Constructors
    public Course() {}

    public Course(Long id, String courseName, String description, String difficulty, String category, String imageUrl) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
        this.difficulty = difficulty;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // Builder
    public static CourseBuilder builder() {
        return new CourseBuilder();
    }

    public static class CourseBuilder {
        private Long id;
        private String courseName;
        private String description;
        private String difficulty;
        private String category;
        private String imageUrl;

        public CourseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CourseBuilder courseName(String courseName) {
            this.courseName = courseName;
            return this;
        }

        public CourseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CourseBuilder difficulty(String difficulty) {
            this.difficulty = difficulty;
            return this;
        }

        public CourseBuilder category(String category) {
            this.category = category;
            return this;
        }

        public CourseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Course build() {
            return new Course(id, courseName, description, difficulty, category, imageUrl);
        }
    }
}
