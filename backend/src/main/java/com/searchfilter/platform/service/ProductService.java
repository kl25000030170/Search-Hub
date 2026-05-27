package com.searchfilter.platform.service;

import com.searchfilter.platform.dto.ProductDTO;
import com.searchfilter.platform.entity.Product;
import com.searchfilter.platform.exception.ResourceNotFoundException;
import com.searchfilter.platform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final SearchLogService searchLogService;

    @Autowired
    public ProductService(ProductRepository productRepository, SearchLogService searchLogService) {
        this.productRepository = productRepository;
        this.searchLogService = searchLogService;
    }

    public List<ProductDTO> getAllProducts(String category, String search) {
        List<Product> products;

        if (search != null && !search.trim().isEmpty()) {
            // Log the search query in the search logs
            searchLogService.createSearchLogFromQuery(search.trim());
        }

        if (category != null && !category.trim().isEmpty() && search != null && !search.trim().isEmpty()) {
            products = productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category.trim(), search.trim());
        } else if (category != null && !category.trim().isEmpty()) {
            products = productRepository.findByCategoryIgnoreCase(category.trim());
        } else if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search.trim(), search.trim());
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = mapToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setRating(productDTO.getRating());
        existingProduct.setCategory(productDTO.getCategory());
        existingProduct.setImageUrl(productDTO.getImageUrl());

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // Helper methods for DTO-Entity mappings
    private ProductDTO mapToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .rating(product.getRating())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .build();
    }

    private Product mapToEntity(ProductDTO productDTO) {
        return Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .rating(productDTO.getRating())
                .category(productDTO.getCategory())
                .imageUrl(productDTO.getImageUrl())
                .build();
    }
}
