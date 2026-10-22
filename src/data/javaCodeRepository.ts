export interface JavaSourceFile {
  name: string;
  path: string;
  category: 'Configuration' | 'Database Schema' | 'Entities' | 'Repositories' | 'Services' | 'Controllers' | 'Security';
  description: string;
  content: string;
}

export const javaSourceFiles: JavaSourceFile[] = [
  {
    name: 'pom.xml',
    path: 'pom.xml',
    category: 'Configuration',
    description: 'Maven build configuration with Spring Boot 3.3, Spring Data JPA, Spring Security, JWT, PostgreSQL/MySQL, and Lombok',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.aurastudio</groupId>
    <artifactId>studio-erp-backend</artifactId>
    <version>1.0.0</version>
    <name>studio-erp-backend</name>
    <description>AuraStudio ERP &amp; Client Portal Backend in Java Spring Boot</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database Drivers (PostgreSQL & MySQL ready) -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT for Admin and Client Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Developer Productivity -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    name: 'application.properties',
    path: 'src/main/resources/application.properties',
    category: 'Configuration',
    description: 'Database configuration, server port, and JWT secret keys',
    content: `# Server Port
server.port=8080

# Database Configuration (PostgreSQL or MySQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/aurastudio_db
spring.datasource.username=postgres
spring.datasource.password=postgres123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# File Upload Limits for High-Res Photography
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=100MB

# JWT Security
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# CORS Configuration for React Frontend
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173`,
  },
  {
    name: 'schema.sql',
    path: 'src/main/resources/schema.sql',
    category: 'Database Schema',
    description: 'PostgreSQL / MySQL DDL for clients, shoots, photos, invoices, and users',
    content: `-- ========================================================
-- AuraStudio ERP & Client Portal Relational Database Schema
-- Compatible with PostgreSQL & MySQL 8+
-- ========================================================

-- 1. Users Table (Admin and Client Accounts)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'ADMIN' or 'CLIENT'
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients Table (Studio Client Profiles)
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    client_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. CLT-2026-081
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    alternate_phone VARCHAR(30),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    notes TEXT,
    access_passcode VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shoots / Projects Table (Client-Wise Studio Data)
CREATE TABLE IF NOT EXISTS shoots (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    shoot_type VARCHAR(50) NOT NULL, -- 'Wedding', 'Pre-Wedding', 'Fashion', 'Portrait', etc.
    event_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    lead_photographer VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Booked', 'Shot_Completed', 'Editing', 'Proofing', 'Album_Design', 'Completed'
    package_title VARCHAR(150) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    advance_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    master_drive_link VARCHAR(500),
    teaser_video_link VARCHAR(500),
    raw_backup_link VARCHAR(500),
    cover_image_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Photos & Album Proofs Table
CREATE TABLE IF NOT EXISTS photos (
    id VARCHAR(36) PRIMARY KEY,
    shoot_id VARCHAR(36) NOT NULL REFERENCES shoots(id) ON DELETE CASCADE,
    title VARCHAR(200),
    photo_url VARCHAR(500) NOT NULL,
    category VARCHAR(80),
    is_selected_for_album BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    client_notes TEXT,
    resolution VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. INV-2026-041
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    shoot_id VARCHAR(36) REFERENCES shoots(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00, -- GST %
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL, -- 'Paid', 'Partial', 'Unpaid'
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Invoice Line Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL
);

-- Indexes for Fast Client-Wise Queries
CREATE INDEX idx_shoots_client_id ON shoots(client_id);
CREATE INDEX idx_photos_shoot_id ON photos(shoot_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_clients_code ON clients(client_code);`,
  },
  {
    name: 'StudioApplication.java',
    path: 'src/main/java/com/aurastudio/StudioApplication.java',
    category: 'Configuration',
    description: 'Spring Boot Main Application Entry Point',
    content: `package com.aurastudio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
public class StudioApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudioApplication.class, args);
        System.out.println("==================================================");
        System.out.println("AuraStudio ERP & Client Portal Backend Running!");
        System.out.println("REST API Docs & Endpoints available at: http://localhost:8080");
        System.out.println("==================================================");
    }
}`,
  },
  {
    name: 'Client.java',
    path: 'src/main/java/com/aurastudio/entity/Client.java',
    category: 'Entities',
    description: 'JPA Entity representing a Studio Client with relations to shoots and invoices',
    content: `package com.aurastudio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "client_code", unique = true, nullable = false, length = 30)
    private String clientCode; // e.g. CLT-2026-081

    @NotBlank(message = "Client name is mandatory")
    @Column(nullable = false, length = 150)
    private String name;

    @Email
    @NotBlank(message = "Client email is mandatory")
    @Column(nullable = false, length = 150)
    private String email;

    @NotBlank(message = "Phone number is mandatory")
    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "alternate_phone", length = 30)
    private String alternatePhone;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "access_passcode", nullable = false, length = 50)
    private String accessPasscode; // Passcode used by client to access their portal

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Shoot> shoots = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invoice> invoices = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
  },
  {
    name: 'Shoot.java',
    path: 'src/main/java/com/aurastudio/entity/Shoot.java',
    category: 'Entities',
    description: 'JPA Entity representing a Shoot / Project client-wise with photos, links, and payments',
    content: `package com.aurastudio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shoots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shoot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private Client client;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "shoot_type", nullable = false, length = 50)
    private String shootType; // Wedding, Pre-Wedding, Fashion, Commercial, Portrait, Event

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false, length = 255)
    private String venue;

    @Column(name = "lead_photographer", nullable = false, length = 100)
    private String leadPhotographer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ShootStatus status; // Booked, Shot_Completed, Editing, Proofing, Album_Design, Completed

    @Column(name = "package_title", nullable = false, length = 150)
    private String packageTitle;

    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "advance_paid", precision = 12, scale = 2, nullable = false)
    private BigDecimal advancePaid;

    @Column(name = "balance_due", precision = 12, scale = 2, nullable = false)
    private BigDecimal balanceDue;

    @Column(name = "master_drive_link", length = 500)
    private String masterDriveLink;

    @Column(name = "teaser_video_link", length = 500)
    private String teaserVideoLink;

    @Column(name = "raw_backup_link", length = 500)
    private String rawBackupLink;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "shoot", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Photo> photos = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ShootStatus {
        Booked, Shot_Completed, Editing, Proofing, Album_Design, Completed
    }
}`,
  },
  {
    name: 'Photo.java',
    path: 'src/main/java/com/aurastudio/entity/Photo.java',
    category: 'Entities',
    description: 'JPA Entity representing photo proofs and client album selections',
    content: `package com.aurastudio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shoot_id", nullable = false)
    @JsonIgnore
    private Shoot shoot;

    @Column(length = 200)
    private String title;

    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;

    @Column(length = 80)
    private String category;

    @Column(name = "is_selected_for_album")
    private Boolean isSelectedForAlbum;

    @Column(name = "is_favorite")
    private Boolean isFavorite;

    @Column(name = "client_notes", columnDefinition = "TEXT")
    private String clientNotes;

    @Column(length = 50)
    private String resolution;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}`,
  },
  {
    name: 'Invoice.java',
    path: 'src/main/java/com/aurastudio/entity/Invoice.java',
    category: 'Entities',
    description: 'JPA Entity representing official Studio Invoices with GST breakdown',
    content: `package com.aurastudio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber; // e.g. INV-2026-041

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private Client client;

    @Column(name = "shoot_id", length = 36)
    private String shootId;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(name = "tax_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal taxRate; // 18.00% GST

    @Column(name = "tax_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal taxAmount;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal discount;

    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal paidAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InvoiceStatus status; // Paid, Partial, Unpaid

    @Column(name = "payment_method", length = 100)
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum InvoiceStatus {
        Paid, Partial, Unpaid
    }
}`,
  },
  {
    name: 'AdminStudioController.java',
    path: 'src/main/java/com/aurastudio/controller/AdminStudioController.java',
    category: 'Controllers',
    description: 'REST Controller for Studio Admin to manage clients, shoots, and financial stats',
    content: `package com.aurastudio.controller;

import com.aurastudio.entity.Client;
import com.aurastudio.entity.Shoot;
import com.aurastudio.entity.Invoice;
import com.aurastudio.service.ClientService;
import com.aurastudio.service.ShootService;
import com.aurastudio.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudioController {

    private final ClientService clientService;
    private final ShootService shootService;
    private final InvoiceService invoiceService;

    // 1. Client Management Endpoints
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.findAllClients());
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable String id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PostMapping("/clients")
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return new ResponseEntity<>(clientService.createClient(client), HttpStatus.CREATED);
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    // 2. Client-Wise Shoots
    @GetMapping("/clients/{clientId}/shoots")
    public ResponseEntity<List<Shoot>> getShootsByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(shootService.getShootsByClientId(clientId));
    }

    @PostMapping("/clients/{clientId}/shoots")
    public ResponseEntity<Shoot> createShootForClient(
            @PathVariable String clientId,
            @RequestBody Shoot shoot) {
        return new ResponseEntity<>(shootService.createShoot(clientId, shoot), HttpStatus.CREATED);
    }

    @PutMapping("/shoots/{shootId}/status")
    public ResponseEntity<Shoot> updateShootStatus(
            @PathVariable String shootId,
            @RequestParam Shoot.ShootStatus status) {
        return ResponseEntity.ok(shootService.updateStatus(shootId, status));
    }

    // 3. Studio Overview & Financial Metrics
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getStudioMetrics() {
        return ResponseEntity.ok(invoiceService.getStudioMetrics());
    }
}`,
  },
  {
    name: 'ClientPortalController.java',
    path: 'src/main/java/com/aurastudio/controller/ClientPortalController.java',
    category: 'Controllers',
    description: 'REST Controller for Clients to access their own shoots, proofs, album selection, and invoices',
    content: `package com.aurastudio.controller;

import com.aurastudio.entity.Photo;
import com.aurastudio.entity.Shoot;
import com.aurastudio.entity.Invoice;
import com.aurastudio.service.ShootService;
import com.aurastudio.service.InvoiceService;
import com.aurastudio.service.PhotoProofingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CLIENT')")
public class ClientPortalController {

    private final ShootService shootService;
    private final PhotoProofingService photoProofingService;
    private final InvoiceService invoiceService;

    // 1. Get logged-in client shoots
    @GetMapping("/my-shoots")
    public ResponseEntity<List<Shoot>> getMyShoots(Authentication authentication) {
        String clientCode = authentication.getName();
        return ResponseEntity.ok(shootService.getShootsByClientCode(clientCode));
    }

    // 2. View Photos in Shoot for Proofing
    @GetMapping("/shoots/{shootId}/photos")
    public ResponseEntity<List<Photo>> getShootPhotos(
            @PathVariable String shootId,
            Authentication authentication) {
        return ResponseEntity.ok(photoProofingService.getPhotosForClient(shootId, authentication.getName()));
    }

    // 3. Toggle Photo Album Selection or Favorite
    @PostMapping("/photos/{photoId}/selection")
    public ResponseEntity<Photo> toggleAlbumSelection(
            @PathVariable String photoId,
            @RequestParam boolean selected,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(photoProofingService.updateAlbumSelection(photoId, selected, notes));
    }

    // 4. Client View Invoices & Payment Summary
    @GetMapping("/my-invoices")
    public ResponseEntity<List<Invoice>> getMyInvoices(Authentication authentication) {
        String clientCode = authentication.getName();
        return ResponseEntity.ok(invoiceService.getInvoicesByClientCode(clientCode));
    }
}`,
  },
  {
    name: 'SecurityConfig.java',
    path: 'src/main/java/com/aurastudio/security/SecurityConfig.java',
    category: 'Security',
    description: 'Spring Security 6 configuration with stateless JWT filters and role permissions',
    content: `package com.aurastudio.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health", "/error").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/client/**").hasRole("CLIENT")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`,
  },
];
