package com.searchfilter.platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchLogDTO {

    private Long id;

    @NotBlank(message = "Search query cannot be empty")
    private String query;

    private LocalDateTime timestamp;
}
