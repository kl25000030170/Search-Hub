package com.searchfilter.platform.controller;

import com.searchfilter.platform.dto.SearchLogDTO;
import com.searchfilter.platform.service.SearchLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/searchlogs")
public class SearchLogController {

    private final SearchLogService searchLogService;

    @Autowired
    public SearchLogController(SearchLogService searchLogService) {
        this.searchLogService = searchLogService;
    }

    @GetMapping
    public ResponseEntity<List<SearchLogDTO>> getAllSearchLogs() {
        List<SearchLogDTO> logs = searchLogService.getAllSearchLogs();
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<SearchLogDTO> createSearchLog(@Valid @RequestBody SearchLogDTO searchLogDTO) {
        SearchLogDTO createdLog = searchLogService.createSearchLog(searchLogDTO);
        return new ResponseEntity<>(createdLog, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSearchLog(@PathVariable Long id) {
        searchLogService.deleteSearchLog(id);
        return ResponseEntity.noContent().build();
    }
}
