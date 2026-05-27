package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(Category category) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(category.getCategoryName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category already exists with name: " + category.getCategoryName());
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category update(Long id, Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id));

        if (category.getCategoryName() != null) {
            if (!existingCategory.getCategoryName().equalsIgnoreCase(category.getCategoryName()) &&
                    categoryRepository.existsByCategoryNameIgnoreCase(category.getCategoryName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category already exists with name: " + category.getCategoryName());
            }
            existingCategory.setCategoryName(category.getCategoryName());
        }

        return categoryRepository.save(existingCategory);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
