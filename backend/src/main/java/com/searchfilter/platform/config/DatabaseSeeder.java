package com.searchfilter.platform.config;

import com.searchfilter.platform.entity.Category;
import com.searchfilter.platform.entity.Course;
import com.searchfilter.platform.entity.Product;
import com.searchfilter.platform.entity.User;
import com.searchfilter.platform.repository.CategoryRepository;
import com.searchfilter.platform.repository.CourseRepository;
import com.searchfilter.platform.repository.ProductRepository;
import com.searchfilter.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Autowired
    public DatabaseSeeder(CategoryRepository categoryRepository,
                          ProductRepository productRepository,
                          CourseRepository courseRepository,
                          UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedUsers();
        seedProducts();
        seedCourses();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                Category.builder().categoryName("Electronics").build(),
                Category.builder().categoryName("Education").build(),
                Category.builder().categoryName("Books").build(),
                Category.builder().categoryName("Courses").build(),
                Category.builder().categoryName("Learning Resources").build(),
                Category.builder().categoryName("Technology Tools").build()
            );
            categoryRepository.saveAll(categories);
            System.out.println("Categories database seeded successfully.");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            List<User> users = Arrays.asList(
                User.builder()
                    .name("Vinayak Padalti")
                    .email("user@gmail.com")
                    .password("password")
                    .role("USER")
                    .build(),
                User.builder()
                    .name("Admin System")
                    .email("admin@gmail.com")
                    .password("password")
                    .role("ADMIN")
                    .build()
            );
            userRepository.saveAll(users);
            System.out.println("Users database seeded successfully. Default users: user@gmail.com / password.");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                Product.builder()
                    .name("Bluetooth Speaker Pro")
                    .description("Portable wireless speaker with deep bass, 12-hour battery life, and IPX7 water resistance. Ideal for study sessions and outdoor use.")
                    .price(79.0)
                    .rating(4.6)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Smart Watch Series X")
                    .description("Fitness tracking, heart-rate monitoring, GPS, and notifications in a lightweight wearable with week-long battery in smart mode.")
                    .price(199.0)
                    .rating(4.5)
                    .category("Technology Tools")
                    .imageUrl("https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Java Programming Book")
                    .description("Comprehensive guide to Java fundamentals, OOP, collections, and modern Java features with practice problems and interview tips.")
                    .price(35.0)
                    .rating(4.7)
                    .category("Books")
                    .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Data Structures Study Kit")
                    .description("Curated learning resources including cheat sheets, visual guides, and practice datasets for mastering data structures.")
                    .price(29.0)
                    .rating(4.4)
                    .category("Learning Resources")
                    .imageUrl("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Wireless Noise-Cancelling Headphones")
                    .description("Premium over-ear headphones with adaptive ANC, multi-device pairing, and studio-grade audio for focused learning.")
                    .price(249.0)
                    .rating(4.8)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Cloud DevOps Toolkit License")
                    .description("Technology tools bundle for CI/CD pipelines, container management, and infrastructure-as-code templates for student projects.")
                    .price(120.0)
                    .rating(4.3)
                    .category("Technology Tools")
                    .imageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Mechanical Gaming Keyboard")
                    .description("Tactile mechanical switches, customizable RGB backlighting, and programmable macro keys for coding/gaming.")
                    .price(110.0)
                    .rating(4.6)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Ergonomic Vertical Mouse")
                    .description("Wireless vertical mouse designed to reduce wrist strain, featuring customizable DPI and 6 programmable buttons.")
                    .price(39.0)
                    .rating(4.5)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80")
                    .build()
            );
            productRepository.saveAll(products);
            System.out.println("Products database seeded successfully.");
        }
    }

    private void seedCourses() {
        if (courseRepository.count() == 0) {
            List<Course> courses = Arrays.asList(
                Course.builder()
                    .courseName("Python Beginner Course")
                    .description("Hands-on introduction to Python covering variables, loops, functions, and small projects. Includes exercises and certificate of completion.")
                    .difficulty("Beginner")
                    .category("Courses")
                    .imageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Course.builder()
                    .courseName("Machine Learning Fundamentals")
                    .description("University-style education module covering supervised learning, model evaluation, and practical ML workflows with notebooks.")
                    .difficulty("Advanced")
                    .category("Education")
                    .imageUrl("https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Course.builder()
                    .courseName("Complete Web Development Bootcamp")
                    .description("Learn full-stack engineering with HTML, CSS, JavaScript, Node, and React. Includes projects and certification.")
                    .difficulty("Beginner")
                    .category("Courses")
                    .imageUrl("https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Course.builder()
                    .courseName("React.js Masterclass")
                    .description("Deep dive into hooks, state management (Zustand/Redux), performance tuning, and routing.")
                    .difficulty("Intermediate")
                    .category("Courses")
                    .imageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Course.builder()
                    .courseName("AI and Neural Networks")
                    .description("Academic learning module covering deep learning, gradient descent, backpropagation, and NLP.")
                    .difficulty("Advanced")
                    .category("Education")
                    .imageUrl("https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80")
                    .build()
            );
            courseRepository.saveAll(courses);
            System.out.println("Courses database seeded successfully.");
        }
    }
}
