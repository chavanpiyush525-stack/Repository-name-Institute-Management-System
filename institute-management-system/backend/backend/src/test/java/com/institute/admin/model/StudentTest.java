package com.institute.admin.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void testDefaultConstructor() {
        Student student = new Student();
        assertNotNull(student);
        assertNull(student.getId());
        assertNull(student.getName());
        assertNull(student.getEmail());
    }

    @Test
    void testParameterizedConstructor() {
        String name = "John Doe";
        String email = "john.doe@example.com";
        
        Student student = new Student(name, email);
        
        assertNotNull(student);
        assertNull(student.getId()); // ID should be null until persisted
        assertEquals(name, student.getName());
        assertEquals(email, student.getEmail());
    }

    @Test
    void testGettersAndSetters() {
        Student student = new Student();
        Long id = 1L;
        String name = "Jane Smith";
        String email = "jane.smith@example.com";
        
        // Test setters
        student.setId(id);
        student.setName(name);
        student.setEmail(email);
        
        // Test getters
        assertEquals(id, student.getId());
        assertEquals(name, student.getName());
        assertEquals(email, student.getEmail());
    }

    @Test
    void testSettersWithNullValues() {
        Student student = new Student("Initial Name", "initial@example.com");
        
        student.setId(null);
        student.setName(null);
        student.setEmail(null);
        
        assertNull(student.getId());
        assertNull(student.getName());
        assertNull(student.getEmail());
    }
}