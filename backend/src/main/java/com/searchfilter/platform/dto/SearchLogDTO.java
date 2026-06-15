package com.searchfilter.platform.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class SearchLogDTO {

    private Long id;

    @NotBlank(message = "Search query cannot be empty")
    private String query;

    private LocalDateTime timestamp;

    // Constructors
    public SearchLogDTO() {}

    public SearchLogDTO(Long id, String query, LocalDateTime timestamp) {
        this.id = id;
        this.query = query;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder
    public static SearchLogDTOBuilder builder() {
        return new SearchLogDTOBuilder();
    }

    public static class SearchLogDTOBuilder {
        private Long id;
        private String query;
        private LocalDateTime timestamp;

        public SearchLogDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SearchLogDTOBuilder query(String query) {
            this.query = query;
            return this;
        }

        public SearchLogDTOBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public SearchLogDTO build() {
            return new SearchLogDTO(id, query, timestamp);
        }
    }
}
