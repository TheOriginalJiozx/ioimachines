package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.NewsletterSubscriberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;
import java.util.Optional;
import com.ioimachines.backend.model.NewsletterSubscriber;

@WebMvcTest(NewsletterController.class)
class NewsletterControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private NewsletterSubscriberRepository repo;

    @Test
    void subscribe_ReturnsOk() throws Exception {
        given(repo.findByEmail("test@example.com")).willReturn(Optional.empty());
        given(repo.save(any(NewsletterSubscriber.class))).willReturn(new NewsletterSubscriber("test@example.com"));
        mockMvc.perform(post("/api/newsletter")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\"}"))
                .andExpect(status().isOk());
    }
}
