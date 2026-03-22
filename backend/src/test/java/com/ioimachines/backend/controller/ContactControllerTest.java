package com.ioimachines.backend.controller;

import com.ioimachines.backend.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;

@WebMvcTest(ContactController.class)
class ContactControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private EmailService emailService;

    @Test
    void submitConsultation_ReturnsOk() throws Exception {
        given(emailService.sendSimpleMessage(any(), any(), any(), any())).willReturn(true);
        mockMvc.perform(post("/api/consultation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"email\":\"test@example.com\",\"message\":\"msg\"}"))
                .andExpect(status().isOk());
    }
}
