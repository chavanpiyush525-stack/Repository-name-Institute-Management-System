package com.institute.admin.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void testDefaultConstructor() {
        Message message = new Message();
        assertNotNull(message);
        assertNull(message.getId());
        assertNull(message.getSenderName());
        assertNull(message.getEmail());
        assertNull(message.getContent());
    }

    @Test
    void testParameterizedConstructor() {
        String senderName = "Alice Johnson";
        String email = "alice@example.com";
        String content = "Hello, this is a test message";
        
        Message message = new Message(senderName, email, content);
        
        assertNotNull(message);
        assertNull(message.getId()); // ID should be null until persisted
        assertEquals(senderName, message.getSenderName());
        assertEquals(email, message.getEmail());
        assertEquals(content, message.getContent());
    }

    @Test
    void testGettersAndSetters() {
        Message message = new Message();
        Long id = 1L;
        String senderName = "Bob Wilson";
        String email = "bob@example.com";
        String content = "Updated message content";
        
        // Test setters
        message.setId(id);
        message.setSenderName(senderName);
        message.setEmail(email);
        message.setContent(content);
        
        // Test getters
        assertEquals(id, message.getId());
        assertEquals(senderName, message.getSenderName());
        assertEquals(email, message.getEmail());
        assertEquals(content, message.getContent());
    }

    @Test
    void testSettersWithNullValues() {
        Message message = new Message("Initial Sender", "initial@example.com", "Initial content");
        
        message.setId(null);
        message.setSenderName(null);
        message.setEmail(null);
        message.setContent(null);
        
        assertNull(message.getId());
        assertNull(message.getSenderName());
        assertNull(message.getEmail());
        assertNull(message.getContent());
    }
}