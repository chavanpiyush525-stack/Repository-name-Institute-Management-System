package com.institute.admin.services;

import com.institute.admin.model.Course;
import com.institute.admin.model.Student;
import com.institute.admin.model.Message;
import com.institute.admin.repository.CourseRepository;
import com.institute.admin.repository.StudentRepository;
import com.institute.admin.repository.MessageRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private AdminService adminService;

    private Course testCourse;
    private Student testStudent;
    private Message testMessage;

    @BeforeEach
    void setUp() {
        testCourse = new Course("Java Programming", "Learn Java fundamentals");
        testCourse.setId(1L);

        testStudent = new Student("John Doe", "john@example.com");
        testStudent.setId(1L);

        testMessage = new Message("Alice", "alice@example.com", "Test message");
        testMessage.setId(1L);
    }

    // ================ Course Management Tests ================

    @Test
    void testGetAllCourses() {
        List<Course> courses = Arrays.asList(testCourse);
        when(courseRepository.findAll()).thenReturn(courses);

        List<Course> result = adminService.getAllCourses();

        assertEquals(1, result.size());
        assertEquals(testCourse, result.get(0));
        verify(courseRepository).findAll();
    }

    @Test
    void testGetCourseById_Found() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));

        Optional<Course> result = adminService.getCourseById(1L);

        assertTrue(result.isPresent());
        assertEquals(testCourse, result.get());
        verify(courseRepository).findById(1L);
    }

    @Test
    void testGetCourseById_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Course> result = adminService.getCourseById(1L);

        assertFalse(result.isPresent());
        verify(courseRepository).findById(1L);
    }

    @Test
    void testAddCourse_Success() {
        Course newCourse = new Course("Spring Boot", "Learn Spring Boot");
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        Course result = adminService.addCourse(newCourse);

        assertEquals(testCourse, result);
        verify(courseRepository).save(newCourse);
    }

    @Test
    void testAddCourse_NullName() {
        Course invalidCourse = new Course(null, "Description");

        assertThrows(IllegalArgumentException.class, () -> {
            adminService.addCourse(invalidCourse);
        });

        verify(courseRepository, never()).save(any());
    }

    @Test
    void testAddCourse_EmptyName() {
        Course invalidCourse = new Course("   ", "Description");

        assertThrows(IllegalArgumentException.class, () -> {
            adminService.addCourse(invalidCourse);
        });

        verify(courseRepository, never()).save(any());
    }    @Test

    void testUpdateCourse_Success() {
        Course updatedCourse = new Course("Updated Name", "Updated Description");
        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        Course result = adminService.updateCourse(1L, updatedCourse);

        assertEquals(testCourse, result);
        verify(courseRepository).findById(1L);
        verify(courseRepository).save(testCourse);
    }

    @Test
    void testUpdateCourse_NotFound() {
        Course updatedCourse = new Course("Updated Name", "Updated Description");
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            adminService.updateCourse(1L, updatedCourse);
        });

        verify(courseRepository).findById(1L);
        verify(courseRepository, never()).save(any());
    }

    @Test
    void testDeleteCourse_Success() {
        when(courseRepository.existsById(1L)).thenReturn(true);

        adminService.deleteCourse(1L);

        verify(courseRepository).existsById(1L);
        verify(courseRepository).deleteById(1L);
    }

    @Test
    void testDeleteCourse_NotFound() {
        when(courseRepository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            adminService.deleteCourse(1L);
        });

        verify(courseRepository).existsById(1L);
        verify(courseRepository, never()).deleteById(anyLong());
    }

    // ================ Student Retrieval Tests ================

    @Test
    void testGetAllStudents() {
        List<Student> students = Arrays.asList(testStudent);
        when(studentRepository.findAll()).thenReturn(students);

        List<Student> result = adminService.getAllStudents();

        assertEquals(1, result.size());
        assertEquals(testStudent, result.get(0));
        verify(studentRepository).findAll();
    }

    @Test
    void testGetStudentById_Found() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));

        Optional<Student> result = adminService.getStudentById(1L);

        assertTrue(result.isPresent());
        assertEquals(testStudent, result.get());
        verify(studentRepository).findById(1L);
    }

    @Test
    void testGetStudentById_NotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Student> result = adminService.getStudentById(1L);

        assertFalse(result.isPresent());
        verify(studentRepository).findById(1L);
    }

    // ================ Message Retrieval Tests ================

    @Test
    void testGetAllMessages() {
        List<Message> messages = Arrays.asList(testMessage);
        when(messageRepository.findAll()).thenReturn(messages);

        List<Message> result = adminService.getAllMessages();

        assertEquals(1, result.size());
        assertEquals(testMessage, result.get(0));
        verify(messageRepository).findAll();
    }

    @Test
    void testGetMessageById_Found() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));

        Optional<Message> result = adminService.getMessageById(1L);

        assertTrue(result.isPresent());
        assertEquals(testMessage, result.get());
        verify(messageRepository).findById(1L);
    }

    @Test
    void testGetMessageById_NotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Message> result = adminService.getMessageById(1L);

        assertFalse(result.isPresent());
        verify(messageRepository).findById(1L);
    }
}