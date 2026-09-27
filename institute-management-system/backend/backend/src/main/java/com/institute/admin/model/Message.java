package com.institute.admin.model;

import jakarta.persistence.*;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String email;
    
    @Column(length = 2000)
    private String content;

    public Message() {}

    public Message(String senderName, String email, String content) {
        this.senderName = senderName;
        this.email = email;
        this.content = content;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getEmail() {
        return email;
    }

    public String getContent() {
        return content;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
