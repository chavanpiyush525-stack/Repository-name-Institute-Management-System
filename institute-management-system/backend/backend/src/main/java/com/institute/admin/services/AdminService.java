package com.institute.admin.services;

import com.institute.admin.model.Course;
import com.institute.admin.model.Student;
import com.institute.admin.model.Message;
import com.institute.admin.repository.CourseRepository;
import com.institute.admin.repository.StudentRepository;
import com.institute.admin.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public AdminService(CourseRepository courseRepository, StudentRepository studentRepository, MessageRepository messageRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.messageRepository = messageRepository;
    }

    // ---------------- Course Management Methods ----------------
    /**
     * Retrieves all courses from the database
     *
     * @return List of all courses
     */
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    /**
     * Retrieves a specific course by its ID
     *
     * @param id The course ID
     * @return Optional containing the course if found
     */
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    /**
     * Adds a new course to the database
     *
     * @param course The course to add
     * @return The saved course with generated ID
     */
    public Course addCourse(Course course) {
        if (course.getName() == null || course.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Course name cannot be null or empty");
        }
        return courseRepository.save(course);
    }

    /**
     * Updates an existing course
     *
     * @param id The ID of the course to update
     * @param updatedCourse The course data to update
     * @return The updated course
     * @throws RuntimeException if course not found
     */
    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            if (updatedCourse.getName() != null && !updatedCourse.getName().trim().isEmpty()) {
                course.setName(updatedCourse.getName());
            }
            if (updatedCourse.getDescription() != null) {
                course.setDescription(updatedCourse.getDescription());
            }
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found with id " + id));
    }

    /**
     * Deletes a course by its ID
     *
     * @param id The ID of the course to delete
     * @throws RuntimeException if course not found
     */
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }


    // ---------------- Student Retrieval Methods ----------------

    /**
     * Retrieves all students from the database
     * @return List of all students
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Retrieves a specific student by their ID
     * @param id The student ID
     * @return Optional containing the student if found
     */
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // ---------------- Message Retrieval Methods ----------------

    /**
     * Retrieves all messages from the database
     * @return List of all messages
     */
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    /**
     * Retrieves a specific message by its ID
     * @param id The message ID
     * @return Optional containing the message if found
     */
    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }

    /**
     * Adds a new message to the database
     * @param message The message to add
     * @return The saved message with generated ID
     */
    public Message addMessage(Message message) {
        if (message.getSenderName() == null || message.getSenderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sender name cannot be null or empty");
        }
        if (message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be null or empty");
        }
        return messageRepository.save(message);
    }
}
