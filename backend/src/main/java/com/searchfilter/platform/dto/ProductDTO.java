package com.searchfilter.platform.dto;

import jakarta.validation.constraints.*;

public class ProductDTO {

    private Long id;

    @NotBlank(message = "Product name cannot be empty")
    private String name;

    private String description;

    @NotNull(message = "Price cannot be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Double price;

    @Min(value = 0, message = "Rating cannot be less than 0")
    @Max(value = 5, message = "Rating cannot be greater than 5")
    private Double rating;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    private String imageUrl;

    // Constructors
    public ProductDTO() {}

    public ProductDTO(Long id, String name, String description, Double price, Double rating, String category, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.rating = rating;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // Builder
    public static ProductDTOBuilder builder() {
        return new ProductDTOBuilder();
    }

    public static class ProductDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Double rating;
        private String category;
        private String imageUrl;

        public ProductDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProductDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductDTOBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public ProductDTOBuilder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public ProductDTOBuilder category(String category) {
            this.category = category;
            return this;
        }

        public ProductDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductDTO build() {
            return new ProductDTO(id, name, description, price, rating, category, imageUrl);
        }
    }
}
