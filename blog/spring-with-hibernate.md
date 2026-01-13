---
title: How to Use Hibernate with PostgreSQL and Spring Boot
date: 2026-01-13
tags: [java, spring-boot, hibernate, postgresql, jpa, database]
excerpt: Learn how to configure and use Hibernate ORM with PostgreSQL in a Spring Boot application, including best practices and common pitfalls.
---

# How to Use Hibernate with PostgreSQL and Spring Boot

Hibernate is a powerful Object-Relational Mapping (ORM) framework that simplifies database interactions in Java applications. When combined with Spring Boot and PostgreSQL, you get a robust and efficient data persistence layer.

## Prerequisites

- Java 17 or higher
- Spring Boot 3.x
- PostgreSQL database
- Maven or Gradle

## Project Setup

### 1. Add Dependencies

Add the following dependencies to your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### 2. Configure Database Connection

Add the following to your `application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

Or using `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: yourpassword
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

## Creating Entities

### Basic Entity Example

```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors, getters, and setters
    public User() {}
    
    public User(String email, String name) {
        this.email = email;
        this.name = name;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

### Relationships Example

```java
@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    
    // Constructors, getters, and setters
}
```

## Repository Layer

Create a repository interface:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :date")
    List<User> findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.id = :id")
    int updateUserName(@Param("id") Long id, @Param("name") String name);
}
```

## Service Layer

```java
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email already exists");
        }
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

## Best Practices

### 1. Use Lazy Loading

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User author;
```

### 2. Enable Batch Processing

```properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

### 3. Use @Transactional Properly

```java
@Service
@Transactional(readOnly = true)
public class UserService {
    
    @Transactional
    public User createUser(User user) {
        // Write operation
    }
    
    public List<User> getAllUsers() {
        // Read operation - uses read-only transaction
    }
}
```

### 4. Handle N+1 Query Problem

Use `@EntityGraph` or `JOIN FETCH`:

```java
@Query("SELECT u FROM User u JOIN FETCH u.posts WHERE u.id = :id")
Optional<User> findByIdWithPosts(@Param("id") Long id);
```

### 5. Use DTOs for Projections

```java
public interface UserProjection {
    String getEmail();
    String getName();
}

@Query("SELECT u.email as email, u.name as name FROM User u")
List<UserProjection> findAllProjections();
```

## Common Issues and Solutions

### Issue 1: Connection Pool Exhaustion

**Solution**: Configure connection pool:

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
```

### Issue 2: LazyInitializationException

**Solution**: Use `@Transactional` or fetch joins:

```java
@Transactional(readOnly = true)
public User getUserWithPosts(Long id) {
    return userRepository.findByIdWithPosts(id)
        .orElseThrow(() -> new EntityNotFoundException());
}
```

### Issue 3: Schema Updates

**Solution**: Use migrations with Flyway or Liquibase instead of `ddl-auto=update` in production.

## Conclusion

Hibernate with PostgreSQL and Spring Boot provides a powerful and efficient way to handle database operations. By following best practices like using lazy loading, batch processing, and proper transaction management, you can build scalable and maintainable applications.
