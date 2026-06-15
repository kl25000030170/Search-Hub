package com.searchfilter.platform.controller;

import com.searchfilter.platform.repository.CategoryRepository;
import com.searchfilter.platform.repository.CourseRepository;
import com.searchfilter.platform.repository.ProductRepository;
import com.searchfilter.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ProductRepository productRepository;

    @Autowired
    public DashboardController(UserRepository userRepository,
                               CategoryRepository categoryRepository,
                               CourseRepository courseRepository,
                               ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalCategories = categoryRepository.count();
        long totalCourses = courseRepository.count();
        long totalProducts = productRepository.count();
        long totalItems = totalCourses + totalProducts;

        stats.put("totalUsers", totalUsers);
        stats.put("totalCategories", totalCategories);
        stats.put("totalCourses", totalCourses);
        stats.put("totalItems", totalItems);
        stats.put("searchCount", 12480); // Default placeholder matching UI expectations

        return ResponseEntity.ok(stats);
    }
}
