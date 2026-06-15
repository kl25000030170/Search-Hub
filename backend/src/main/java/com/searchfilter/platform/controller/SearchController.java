package com.searchfilter.platform.controller;

import com.searchfilter.platform.dto.CategoryDTO;
import com.searchfilter.platform.dto.CourseDTO;
import com.searchfilter.platform.service.CategoryService;
import com.searchfilter.platform.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final CategoryService categoryService;
    private final CourseService courseService;

    @Autowired
    public SearchController(CategoryService categoryService, CourseService courseService) {
        this.categoryService = categoryService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam(required = false) String q) {
        Map<String, Object> response = new HashMap<>();

        // 1. Fetch matching categories
        List<CategoryDTO> categories = categoryService.getAllCategories();
        if (q != null && !q.trim().isEmpty()) {
            String searchTerm = q.trim().toLowerCase();
            categories = categories.stream()
                    .filter(c -> c.getCategoryName().toLowerCase().contains(searchTerm))
                    .collect(Collectors.toList());
        }

        // 2. Fetch matching courses (CourseService already handles search query and logs it)
        List<CourseDTO> courses = courseService.getAllCourses(null, q);

        response.put("categories", categories);
        response.put("courses", courses);

        return ResponseEntity.ok(response);
    }
}
