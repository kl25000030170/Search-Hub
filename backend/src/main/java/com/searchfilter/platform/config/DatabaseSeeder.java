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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(CategoryRepository categoryRepository,
                          ProductRepository productRepository,
                          CourseRepository courseRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedUsers();
        productRepository.deleteAll();
        courseRepository.deleteAll();
        seedProducts();
        seedCourses();
    }

    private void seedCategories() {
        categoryRepository.deleteAll();
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

    private void seedUsers() {
        // Ensure default admin (gmail) exists
        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
            u -> {
                if (u.getPassword() == null || u.getPassword().startsWith("$2")) {
                    u.setPassword("password");
                    userRepository.save(u);
                }
            },
            () -> {
                User admin = User.builder()
                    .name("Admin System")
                    .email("admin@gmail.com")
                    .password("password")
                    .role("ADMIN")
                    .build();
                userRepository.save(admin);
                System.out.println("Created default admin@gmail.com.");
            }
        );

        // Ensure default user (gmail) exists
        userRepository.findByEmail("user@gmail.com").ifPresentOrElse(
            u -> {
                if (u.getPassword() == null || u.getPassword().startsWith("$2")) {
                    u.setPassword("password");
                    userRepository.save(u);
                }
            },
            () -> {
                User user = User.builder()
                    .name("Vinayak Padalti")
                    .email("user@gmail.com")
                    .password("password")
                    .role("USER")
                    .build();
                userRepository.save(user);
                System.out.println("Created default user@gmail.com.");
            }
        );

        // Ensure frontend default admin (example.com) exists
        userRepository.findByEmail("admin@example.com").ifPresentOrElse(
            u -> {
                if (u.getPassword() == null || u.getPassword().startsWith("$2")) {
                    u.setPassword("admin123");
                    userRepository.save(u);
                }
            },
            () -> {
                User admin = User.builder()
                    .name("Platform Admin")
                    .email("admin@example.com")
                    .password("admin123")
                    .role("ADMIN")
                    .build();
                userRepository.save(admin);
                System.out.println("Created platform admin@example.com.");
            }
        );

        // Ensure frontend default user (example.com) exists
        userRepository.findByEmail("user@example.com").ifPresentOrElse(
            u -> {
                if (u.getPassword() == null || u.getPassword().startsWith("$2")) {
                    u.setPassword("password123");
                    userRepository.save(u);
                }
            },
            () -> {
                User user = User.builder()
                    .name("Demo User")
                    .email("user@example.com")
                    .password("password123")
                    .role("USER")
                    .build();
                userRepository.save(user);
                System.out.println("Created demo user@example.com.");
            }
        );

        // For other existing users, verify plain-text passwords for development
        List<User> existingUsers = userRepository.findAll();
        for (User u : existingUsers) {
            if (u.getPassword() != null && u.getPassword().startsWith("$2")) {
                String plainPassword = "password123";
                if ("sai@gmail.com".equalsIgnoreCase(u.getEmail()) || "admin@gmail.com".equalsIgnoreCase(u.getEmail())) {
                    plainPassword = "password";
                } else if ("admin@example.com".equalsIgnoreCase(u.getEmail())) {
                    plainPassword = "admin123";
                }
                u.setPassword(plainPassword);
                userRepository.save(u);
                System.out.println("Reverted BCrypt password to plain-text for user: " + u.getEmail());
            }
        }
    }

    private void seedProducts() {
        List<Product> products = Arrays.asList(
            // Seed 4 Books from the 10 EdTech requested products
            Product.builder()
                .name("PostgreSQL Professional")
                .description("Advanced relational database design and SQL optimization with PostgreSQL.")
                .price(1199.0)
                .rating(4.7)
                .category("Books")
                .imageUrl("https://images.unsplash.com/photo-1484417894907-623942c8ea29?w=600&auto=format&fit=crop&q=80")
                .build(),
            Product.builder()
                .name("FastAPI Complete Guide")
                .description("Build high-performance APIs using Python and FastAPI.")
                .price(1099.0)
                .rating(4.8)
                .category("Books")
                .imageUrl("https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=80")
                .build(),
            Product.builder()
                .name("Machine Learning Basics")
                .description("Introduction to regression, classification, and neural networks.")
                .price(1599.0)
                .rating(4.9)
                .category("Books")
                .imageUrl("https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80")
                .build(),
            Product.builder()
                .name("Cloud Computing Fundamentals")
                .description("Learn AWS, Azure, and deployment strategies for cloud applications.")
                .price(1299.0)
                .rating(4.7)
                .category("Books")
                .imageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80")
                .build(),

            // Seed original default books and products under original categories
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
                .imageUrl("https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop&q=80")
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
                .build(),
            Product.builder()
                .name("Smart LED Desk Lamp")
                .description("Adjustable brightness, eye-care technology, and wireless smartphone charger integrated into the base.")
                .price(45.0)
                .rating(4.4)
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80")
                .build()
        );

        for (Product p : products) {
            if (!productRepository.existsByName(p.getName())) {
                productRepository.save(p);
                System.out.println("Seeded product: " + p.getName());
            }
        }
    }

    private void seedCourses() {
        List<Course> courses = Arrays.asList(
            // Seed 6 Courses from the 10 EdTech requested products
            Course.builder()
                .courseName("Java Programming Mastery")
                .description("Complete Java programming for beginners and advanced learners.")
                .difficulty("Beginner")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("Python for Data Science")
                .description("Learn Python with real-world projects.")
                .difficulty("Intermediate")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("Spring Boot Development")
                .description("Master Spring Boot framework and build enterprise REST APIs.")
                .difficulty("Advanced")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("React Frontend Development")
                .description("Build modern, fast, and responsive user interfaces using React.")
                .difficulty("Intermediate")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("Node.js API Development")
                .description("Learn to build scalable backend systems with Node.js and Express.")
                .difficulty("Advanced")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("MongoDB Essentials")
                .description("Master NoSQL databases and document design using MongoDB.")
                .difficulty("Intermediate")
                .category("Courses")
                .imageUrl("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80")
                .build(),

            // Seed original default courses
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
                .imageUrl("https://images.unsplash.com/photo-1581291518857-47297b890984?w=600&auto=format&fit=crop&q=80")
                .build(),
            Course.builder()
                .courseName("AI and Neural Networks")
                .description("Academic learning module covering deep learning, gradient descent, backpropagation, and NLP.")
                .difficulty("Advanced")
                .category("Education")
                .imageUrl("https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80")
                .build()
        );

        List<Course> existing = courseRepository.findAll();
        for (Course c : courses) {
            boolean exists = existing.stream().anyMatch(ex -> ex.getCourseName().equalsIgnoreCase(c.getCourseName()));
            if (!exists) {
                courseRepository.save(c);
                System.out.println("Seeded course: " + c.getCourseName());
            }
        }
    }
}
