package com.institute.admin.controller;

import com.institute.admin.model.Course;
import com.institute.admin.model.Message;
import com.institute.admin.services.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = {"http://localhost:4300", "http://localhost:4200"})
public class PublicController {

    private final AdminService adminService;

    @Autowired
    public PublicController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ---------------- Public Course Endpoints ----------------

    /**
     * GET /api/public/courses - Retrieve all courses for public viewing
     */
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = adminService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/public/courses/{id} - Retrieve a specific course by ID for public viewing
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> course = adminService.getCourseById(id);
            return course.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- Contact Form Endpoints ----------------

    /**
     * POST /api/public/contact - Submit a contact form message
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> submitContactForm(@RequestBody ContactFormRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate required fields
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Message is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Create message content with additional fields
            StringBuilder messageContent = new StringBuilder();
            messageContent.append("Subject: ").append(request.getSubject() != null ? request.getSubject() : "General Inquiry").append("\n\n");
            messageContent.append("Message: ").append(request.getMessage()).append("\n\n");
            
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                messageContent.append("Phone: ").append(request.getPhone()).append("\n");
            }
            
            if (request.getCourseInterest() != null && !request.getCourseInterest().trim().isEmpty()) {
                messageContent.append("Course Interest: ").append(request.getCourseInterest()).append("\n");
            }

            // Create and save message
            Message message = new Message(request.getName(), request.getEmail(), messageContent.toString());
            adminService.addMessage(message);

            response.put("success", true);
            response.put("message", "Thank you for your message. We will get back to you soon!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while sending your message. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ---------------- Institute Information Endpoints ----------------

    /**
     * GET /api/public/institute-info - Get basic institute information
     */
    @GetMapping("/institute-info")
    public ResponseEntity<Map<String, Object>> getInstituteInfo() {
        try {
            Map<String, Object> instituteInfo = new HashMap<>();
            
            // Basic institute information
            instituteInfo.put("name", "Excellence Institute");
            instituteInfo.put("tagline", "Empowering Minds, Shaping Futures");
            instituteInfo.put("description", "A premier educational institution dedicated to providing quality education and fostering innovation.");
            instituteInfo.put("mission", "To provide world-class education and create leaders of tomorrow through innovative teaching methods and comprehensive skill development.");
            instituteInfo.put("vision", "To be the leading educational institution that transforms lives and contributes to society's progress.");
            
            // Contact information
            Map<String, Object> contactInfo = new HashMap<>();
            contactInfo.put("email", "info@excellenceinstitute.com");
            contactInfo.put("phone", "+1 (555) 123-4567");
            contactInfo.put("address", "123 Education Street, Learning City, LC 12345");
            contactInfo.put("officeHours", "Monday - Friday: 9:00 AM - 6:00 PM");
            instituteInfo.put("contactInfo", contactInfo);
            
            // Statistics
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalStudents", 1500);
            statistics.put("totalCourses", adminService.getAllCourses().size());
            statistics.put("yearsOfExperience", 15);
            statistics.put("successRate", 95);
            instituteInfo.put("statistics", statistics);
            
            return ResponseEntity.ok(instituteInfo);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- Health Check Endpoint ----------------

    /**
     * GET /api/public/health - Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(health);
    }

    // ---------------- Inner Classes ----------------

    /**
     * Contact form request DTO
     */
    public static class ContactFormRequest {
        private String name;
        private String email;
        private String phone;
        private String subject;
        private String message;
        private String courseInterest;

        // Constructors
        public ContactFormRequest() {}

        public ContactFormRequest(String name, String email, String phone, String subject, String message, String courseInterest) {
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.subject = subject;
            this.message = message;
            this.courseInterest = courseInterest;
        }

        // Getters
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getSubject() { return subject; }
        public String getMessage() { return message; }
        public String getCourseInterest() { return courseInterest; }

        // Setters
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
        public void setPhone(String phone) { this.phone = phone; }
        public void setSubject(String subject) { this.subject = subject; }
        public void setMessage(String message) { this.message = message; }
        public void setCourseInterest(String courseInterest) { this.courseInterest = courseInterest; }
    }
}