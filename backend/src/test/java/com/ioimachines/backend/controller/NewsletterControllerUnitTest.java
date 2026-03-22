package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.NewsletterSubscriber;
import com.ioimachines.backend.repository.NewsletterSubscriberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NewsletterControllerUnitTest {
    @Mock
    private NewsletterSubscriberRepository repo;
    @InjectMocks
    private NewsletterController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void subscribe_ReturnsOk() {
        when(repo.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(repo.save(any(NewsletterSubscriber.class))).thenReturn(new NewsletterSubscriber("test@example.com"));
        Map<String, Object> payload = Map.of("email", "test@example.com");
        ResponseEntity<?> resp = controller.subscribe(payload);
        assertEquals(200, resp.getStatusCodeValue());
    }
}
