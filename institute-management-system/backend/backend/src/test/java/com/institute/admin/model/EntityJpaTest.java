package com.institute.admin.model;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class EntityJpaTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testCourseJpaAnnotations() {
        Course course = new Course("Test Course", "Test Description");
        
        // Persist the entity
        Course savedCourse = entityManager.persistAndFlush(course);
        
        // Verify ID was generated
        assertNotNull(savedCourse.getId());
        assertTrue(savedCourse.getId() > 0);
        assertEquals("Test Course", savedCourse.getName());
        assertEquals("Test Description", savedCourse.getDescription());
    }

    @Test
    void testStudentJpaAnnotations() {
        Student student = new Student("Test Student", "test@example.com");
        
        // Persist the entity
        Student savedStudent = entityManager.persistAndFlush(student);
        
        // Verify ID was generated
        assertNotNull(savedStudent.getId());
        assertTrue(savedStudent.getId() > 0);
        assertEquals("Test Student", savedStudent.getName());
        assertEquals("test@example.com", savedStudent.getEmail());
    }

    @Test
    void testMessageJpaAnnotations() {
        Message message = new Message("Test Sender", "sender@example.com", "Test Content");
        
        // Persist the entity
        Message savedMessage = entityManager.persistAndFlush(message);
        
        // Verify ID was generated
        assertNotNull(savedMessage.getId());
        assertTrue(savedMessage.getId() > 0);
        assertEquals("Test Sender", savedMessage.getSenderName());
        assertEquals("sender@example.com", savedMessage.getEmail());
        assertEquals("Test Content", savedMessage.getContent());
    }
}