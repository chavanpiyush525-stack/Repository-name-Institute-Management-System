package com.institute.admin.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CourseTest {

    @Test
    void testDefaultConstructor() {
        Course course = new Course();
        assertNotNull(course);
        assertNull(course.getId());
        assertNull(course.getName());
        assertNull(course.getDescription());
    }

    @Test
    void testParameterizedConstructor() {
        String name = "Java Programming";
        String description = "Learn Java fundamentals";
        
        Course course = new Course(name, description);
        
        assertNotNull(course);
        assertNull(course.getId()); // ID should be null until persisted
        assertEquals(name, course.getName());
        assertEquals(description, course.getDescription());
    }

    @Test
    void testGettersAndSetters() {
        Course course = new Course();
        Long id = 1L;
        String name = "Spring Boot";
        String description = "Advanced Spring Boot concepts";
        
        // Test setters
        course.setId(id);
        course.setName(name);
        course.setDescription(description);
        
        // Test getters
        assertEquals(id, course.getId());
        assertEquals(name, course.getName());
        assertEquals(description, course.getDescription());
    }

    @Test
    void testSettersWithNullValues() {
        Course course = new Course("Initial Name", "Initial Description");
        
        course.setId(null);
        course.setName(null);
        course.setDescription(null);
        
        assertNull(course.getId());
        assertNull(course.getName());
        assertNull(course.getDescription());
    }
}