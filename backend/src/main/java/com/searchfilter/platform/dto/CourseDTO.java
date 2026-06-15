package com.searchfilter.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class CourseDTO {

    private Long id;

    @NotBlank(message = "Course name cannot be empty")
    private String courseName;

    private String description;

    @NotBlank(message = "Difficulty level cannot be empty")
    private String difficulty;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    private String imageUrl;

    // Constructors
    public CourseDTO() {}

    public CourseDTO(Long id, String courseName, String description, String difficulty, String category, String imageUrl) {
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
    public static CourseDTOBuilder builder() {
        return new CourseDTOBuilder();
    }

    public static class CourseDTOBuilder {
        private Long id;
        private String courseName;
        private String description;
        private String difficulty;
        private String category;
        private String imageUrl;

        public CourseDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CourseDTOBuilder courseName(String courseName) {
            this.courseName = courseName;
            return this;
        }

        public CourseDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CourseDTOBuilder difficulty(String difficulty) {
            this.difficulty = difficulty;
            return this;
        }

        public CourseDTOBuilder category(String category) {
            this.category = category;
            return this;
        }

        public CourseDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public CourseDTO build() {
            return new CourseDTO(id, courseName, description, difficulty, category, imageUrl);
        }
    }
}
