package com.searchfilter.platform.service;

import com.searchfilter.platform.dto.SearchLogDTO;
import com.searchfilter.platform.entity.SearchLog;
import com.searchfilter.platform.exception.ResourceNotFoundException;
import com.searchfilter.platform.repository.SearchLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SearchLogService {

    private final SearchLogRepository searchLogRepository;

    @Autowired
    public SearchLogService(SearchLogRepository searchLogRepository) {
        this.searchLogRepository = searchLogRepository;
    }

    public List<SearchLogDTO> getAllSearchLogs() {
        return searchLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SearchLogDTO createSearchLog(SearchLogDTO searchLogDTO) {
        SearchLog searchLog = mapToEntity(searchLogDTO);
        SearchLog savedLog = searchLogRepository.save(searchLog);
        return mapToDTO(savedLog);
    }

    public void createSearchLogFromQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            return;
        }
        SearchLog searchLog = SearchLog.builder()
                .query(query.trim())
                .build();
        searchLogRepository.save(searchLog);
    }

    public void deleteSearchLog(Long id) {
        if (!searchLogRepository.existsById(id)) {
            throw new ResourceNotFoundException("SearchLog not found with id: " + id);
        }
        searchLogRepository.deleteById(id);
    }

    // Helper methods for DTO-Entity mappings
    private SearchLogDTO mapToDTO(SearchLog searchLog) {
        return SearchLogDTO.builder()
                .id(searchLog.getId())
                .query(searchLog.getQuery())
                .timestamp(searchLog.getTimestamp())
                .build();
    }

    private SearchLog mapToEntity(SearchLogDTO searchLogDTO) {
        return SearchLog.builder()
                .id(searchLogDTO.getId())
                .query(searchLogDTO.getQuery())
                .timestamp(searchLogDTO.getTimestamp())
                .build();
    }
}
