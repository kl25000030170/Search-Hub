package com.searchfilter.platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
