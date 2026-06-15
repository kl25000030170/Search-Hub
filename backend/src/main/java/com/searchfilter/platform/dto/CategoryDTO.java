package com.searchfilter.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {

    private Long id;

    @NotBlank(message = "Category name cannot be empty")
    private String categoryName;

    // Constructors
    public CategoryDTO() {}

    public CategoryDTO(Long id, String categoryName) {
        this.id = id;
        this.categoryName = categoryName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    // Builder
    public static CategoryDTOBuilder builder() {
        return new CategoryDTOBuilder();
    }

    public static class CategoryDTOBuilder {
        private Long id;
        private String categoryName;

        public CategoryDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CategoryDTOBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public CategoryDTO build() {
            return new CategoryDTO(id, categoryName);
        }
    }
}
