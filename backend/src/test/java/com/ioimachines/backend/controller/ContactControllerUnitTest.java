package com.ioimachines.backend.controller;

import com.ioimachines.backend.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContactControllerUnitTest {
    @Mock
    private EmailService emailService;
    @InjectMocks
    private ContactController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void submitConsultation_ReturnsOk() {
        when(emailService.sendSimpleMessage(any(), any(), any(), any())).thenReturn(true);
        Map<String, Object> payload = Map.of("name", "Test", "email", "test@example.com", "message", "msg");
        ResponseEntity<?> resp = controller.submitConsultation(payload);
        assertEquals(200, resp.getStatusCodeValue());
    }
}
