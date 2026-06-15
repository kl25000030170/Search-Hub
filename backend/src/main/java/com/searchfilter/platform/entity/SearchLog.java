package com.searchfilter.platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_logs")
public class SearchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "search_query", nullable = false)
    private String query;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Constructors
    public SearchLog() {}

    public SearchLog(Long id, String query, LocalDateTime timestamp) {
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
    public static SearchLogBuilder builder() {
        return new SearchLogBuilder();
    }

    public static class SearchLogBuilder {
        private Long id;
        private String query;
        private LocalDateTime timestamp;

        public SearchLogBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SearchLogBuilder query(String query) {
            this.query = query;
            return this;
        }

        public SearchLogBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public SearchLog build() {
            return new SearchLog(id, query, timestamp);
        }
    }
}
