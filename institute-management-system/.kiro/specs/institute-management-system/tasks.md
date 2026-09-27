# Implementation Plan

- [x] 1. Set up project structure and Maven configuration





  - Create Maven pom.xml with Spring Boot dependencies (Web, Data JPA, H2, Test)
  - Set up proper directory structure under backend/src/main/java/com/institute/admin/
  - Create application.properties with H2 database configuration
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Implement core entity models





  - [x] 2.1 Create Course entity with JPA annotations

    - Define Course class with id, name, description fields
    - Add proper JPA annotations (@Entity, @Id, @GeneratedValue)
    - Implement getters and setters
    - _Requirements: 5.1, 5.4_
  
  - [x] 2.2 Create Student entity with JPA annotations

    - Define Student class with id, name, email fields
    - Add proper JPA annotations (@Entity, @Id, @GeneratedValue)
    - Implement getters and setters
    - _Requirements: 5.2, 5.4_
  
  - [x] 2.3 Create Message entity with JPA annotations

    - Define Message class with id, senderName, email, content fields
    - Add proper JPA annotations (@Entity, @Id, @GeneratedValue)
    - Implement getters and setters
    - _Requirements: 5.3, 5.4_

- [x] 3. Implement repository layer





  - [x] 3.1 Create CourseRepository interface


    - Extend JpaRepository<Course, Long>
    - Add Spring Data JPA annotations
    - _Requirements: 6.1_
  
  - [x] 3.2 Create StudentRepository interface


    - Extend JpaRepository<Student, Long>
    - Add Spring Data JPA annotations
    - _Requirements: 6.2_
  
  - [x] 3.3 Create MessageRepository interface


    - Extend JpaRepository<Message, Long>
    - Add Spring Data JPA annotations
    - _Requirements: 6.3_

- [x] 4. Implement service layer





  - [x] 4.1 Create AdminService class with course management methods


    - Implement getAllCourses(), getCourseById(), addCourse(), updateCourse(), deleteCourse()
    - Add @Service annotation and dependency injection for CourseRepository
    - Handle business logic and error cases
    - _Requirements: 7.1, 1.1, 1.2, 1.3, 1.4, 1.5_

  
  - [x] 4.2 Add student retrieval methods to AdminService





    - Implement getAllStudents() and getStudentById() methods
    - Inject StudentRepository dependency

    - _Requirements: 7.2, 2.1, 2.2_
  
  - [x] 4.3 Add message retrieval methods to AdminService





    - Implement getAllMessages() and getMessageById() methods
    - Inject MessageRepository dependency
    - _Requirements: 7.3, 3.1, 3.2_

- [x] 5. Implement REST controller layer


  - [x] 5.1 Create AdminController with course endpoints





    - Implement GET/POST /admin/courses endpoints
    - Implement GET/PUT/DELETE /admin/courses/{id} endpoints
    - Add @RestController and @RequestMapping annotations
    - Inject AdminService dependency
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 5.2 Add student endpoints to AdminController





    - Implement GET /admin/students and GET /admin/students/{id} endpoints
    - Use AdminService for business logic
    - _Requirements: 2.1, 2.2_
  
  - [x] 5.3 Add message endpoints to AdminController





    - Implement GET /admin/messages and GET /admin/messages/{id} endpoints
    - Use AdminService for business logic
    - _Requirements: 3.1, 3.2_

- [x] 6. Configure CORS and application settings





  - [x] 6.1 Implement CORS configuration


    - Configure CORS to allow requests from http://localhost:4200
    - Add @CrossOrigin annotation or global CORS configuration
    - _Requirements: 4.1, 4.2_
  
  - [x] 6.2 Create main Spring Boot application class


    - Add @SpringBootApplication annotation
    - Ensure application runs on port 8080
    - _Requirements: 8.1_

- [x] 7. Create unit tests for core functionality





  - [x] 7.1 Write unit tests for entity models


    - Test entity creation and getter/setter methods
    - Validate JPA annotations work correctly
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 7.2 Write unit tests for service layer


    - Mock repository dependencies
    - Test all AdminService methods with various scenarios
    - Test error handling for not found cases
    - _Requirements: 7.1, 7.2, 7.3_
  

  - [x] 7.3 Write integration tests for REST endpoints

    - Use MockMvc to test controller endpoints
    - Test complete request-response flow
    - Verify CORS configuration works
    - _Requirements: 1.1-1.5, 2.1-2.2, 3.1-3.2, 4.1-4.2_