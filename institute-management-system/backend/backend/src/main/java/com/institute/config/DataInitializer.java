package com.institute.config;

import com.institute.admin.model.Student;
import com.institute.admin.model.Message;
import com.institute.admin.repository.StudentRepository;
import com.institute.admin.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample students if none exist
        if (studentRepository.count() == 0) {
            initializeStudents();
        }

        // Initialize sample messages if none exist
        if (messageRepository.count() == 0) {
            initializeMessages();
        }
    }

    private void initializeStudents() {
        Student student1 = new Student("Alice Johnson", "alice.johnson@email.com");
        Student student2 = new Student("Bob Smith", "bob.smith@email.com");
        Student student3 = new Student("Carol Davis", "carol.davis@email.com");
        Student student4 = new Student("David Wilson", "david.wilson@email.com");
        Student student5 = new Student("Emma Brown", "emma.brown@email.com");
        Student student6 = new Student("Frank Miller", "frank.miller@email.com");
        Student student7 = new Student("Grace Lee", "grace.lee@email.com");
        Student student8 = new Student("Henry Taylor", "henry.taylor@email.com");

        studentRepository.save(student1);
        studentRepository.save(student2);
        studentRepository.save(student3);
        studentRepository.save(student4);
        studentRepository.save(student5);
        studentRepository.save(student6);
        studentRepository.save(student7);
        studentRepository.save(student8);

        System.out.println("✅ Initialized " + studentRepository.count() + " sample students");
    }

    private void initializeMessages() {
        Message message1 = new Message("Alice Johnson", "alice.johnson@email.com", 
            "Hello! I'm interested in enrolling in the Advanced JavaScript course. Could you please provide more information about the prerequisites and schedule?");
        
        Message message2 = new Message("Bob Smith", "bob.smith@email.com", 
            "I'm having trouble accessing the course materials. Could someone help me with the login process?");
        
        Message message3 = new Message("Carol Davis", "carol.davis@email.com", 
            "Thank you for the excellent Spring Boot course! The content was very comprehensive and well-structured. I would love to see more advanced topics covered.");
        
        Message message4 = new Message("David Wilson", "david.wilson@email.com", 
            "Is there a mobile app available for accessing course content? It would be great to study on the go.");
        
        Message message5 = new Message("Emma Brown", "emma.brown@email.com", 
            "I'm interested in the upcoming React course. When will registration open and what are the fees?");

        messageRepository.save(message1);
        messageRepository.save(message2);
        messageRepository.save(message3);
        messageRepository.save(message4);
        messageRepository.save(message5);

        System.out.println("✅ Initialized " + messageRepository.count() + " sample messages");
    }
}