package com.institute.admin.controller;

import com.institute.admin.model.Course;
import com.institute.admin.model.Student;
import com.institute.admin.model.Message;
import com.institute.admin.services.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

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

    // ================ Course Endpoint Tests ================

    @Test
    void testGetAllCourses() throws Exception {
        List<Course> courses = Arrays.asList(testCourse);
        when(adminService.getAllCourses()).thenReturn(courses);

        mockMvc.perform(get("/admin/courses"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Java Programming"))
                .andExpect(jsonPath("$[0].description").value("Learn Java fundamentals"));

        verify(adminService).getAllCourses();
    }

    @Test
    void testCreateCourse_Success() throws Exception {
        Course newCourse = new Course("Spring Boot", "Learn Spring Boot");
        when(adminService.addCourse(any(Course.class))).thenReturn(testCourse);

        mockMvc.perform(post("/admin/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCourse)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Java Programming"));

        verify(adminService).addCourse(any(Course.class));
    }

    @Test
    void testCreateCourse_BadRequest() throws Exception {
        Course invalidCourse = new Course(null, "Description");
        when(adminService.addCourse(any(Course.class))).thenThrow(new IllegalArgumentException());

        mockMvc.perform(post("/admin/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidCourse)))
                .andExpect(status().isBadRequest());

        verify(adminService).addCourse(any(Course.class));
    }

    @Test
    void testGetCourseById_Found() throws Exception {
        when(adminService.getCourseById(1L)).thenReturn(Optional.of(testCourse));

        mockMvc.perform(get("/admin/courses/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Java Programming"));

        verify(adminService).getCourseById(1L);
    }

    @Test
    void testGetCourseById_NotFound() throws Exception {
        when(adminService.getCourseById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/admin/courses/1"))
                .andExpect(status().isNotFound());

        verify(adminService).getCourseById(1L);
    }  
  @Test
    void testUpdateCourse_Success() throws Exception {
        Course updatedCourse = new Course("Updated Name", "Updated Description");
        when(adminService.updateCourse(anyLong(), any(Course.class))).thenReturn(testCourse);

        mockMvc.perform(put("/admin/courses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCourse)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1));

        verify(adminService).updateCourse(eq(1L), any(Course.class));
    }

    @Test
    void testUpdateCourse_NotFound() throws Exception {
        Course updatedCourse = new Course("Updated Name", "Updated Description");
        when(adminService.updateCourse(anyLong(), any(Course.class))).thenThrow(new RuntimeException());

        mockMvc.perform(put("/admin/courses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCourse)))
                .andExpect(status().isNotFound());

        verify(adminService).updateCourse(eq(1L), any(Course.class));
    }

    @Test
    void testDeleteCourse_Success() throws Exception {
        doNothing().when(adminService).deleteCourse(1L);

        mockMvc.perform(delete("/admin/courses/1"))
                .andExpect(status().isNoContent());

        verify(adminService).deleteCourse(1L);
    }

    @Test
    void testDeleteCourse_NotFound() throws Exception {
        doThrow(new RuntimeException()).when(adminService).deleteCourse(1L);

        mockMvc.perform(delete("/admin/courses/1"))
                .andExpect(status().isNotFound());

        verify(adminService).deleteCourse(1L);
    }

    // ================ Student Endpoint Tests ================

    @Test
    void testGetAllStudents() throws Exception {
        List<Student> students = Arrays.asList(testStudent);
        when(adminService.getAllStudents()).thenReturn(students);

        mockMvc.perform(get("/admin/students"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"));

        verify(adminService).getAllStudents();
    }

    @Test
    void testGetStudentById_Found() throws Exception {
        when(adminService.getStudentById(1L)).thenReturn(Optional.of(testStudent));

        mockMvc.perform(get("/admin/students/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));

        verify(adminService).getStudentById(1L);
    }

    @Test
    void testGetStudentById_NotFound() throws Exception {
        when(adminService.getStudentById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/admin/students/1"))
                .andExpect(status().isNotFound());

        verify(adminService).getStudentById(1L);
    }

    // ================ Message Endpoint Tests ================

    @Test
    void testGetAllMessages() throws Exception {
        List<Message> messages = Arrays.asList(testMessage);
        when(adminService.getAllMessages()).thenReturn(messages);

        mockMvc.perform(get("/admin/messages"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].senderName").value("Alice"))
                .andExpect(jsonPath("$[0].email").value("alice@example.com"))
                .andExpect(jsonPath("$[0].content").value("Test message"));

        verify(adminService).getAllMessages();
    }

    @Test
    void testGetMessageById_Found() throws Exception {
        when(adminService.getMessageById(1L)).thenReturn(Optional.of(testMessage));

        mockMvc.perform(get("/admin/messages/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.senderName").value("Alice"));

        verify(adminService).getMessageById(1L);
    }

    @Test
    void testGetMessageById_NotFound() throws Exception {
        when(adminService.getMessageById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/admin/messages/1"))
                .andExpect(status().isNotFound());

        verify(adminService).getMessageById(1L);
    }

    // ================ CORS Configuration Test ================

    @Test
    void testCorsConfiguration() throws Exception {
        List<Course> courses = Arrays.asList(testCourse);
        when(adminService.getAllCourses()).thenReturn(courses);

        mockMvc.perform(get("/admin/courses")
                .header("Origin", "http://localhost:4200"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));

        verify(adminService).getAllCourses();
    }

    @Test
    void testCorsPreflightRequest() throws Exception {
        mockMvc.perform(options("/admin/courses")
                .header("Origin", "http://localhost:4200")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS"))
                .andExpect(header().string("Access-Control-Allow-Headers", "Content-Type"));
    }
}