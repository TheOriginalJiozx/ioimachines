package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.ModalTextsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ModalTextsControllerUnitTest {
    @Mock
    private ModalTextsRepository repository;
    @InjectMocks
    private ModalTextsController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void getModalTexts_ReturnsEmptyIfNotFound() {
        when(repository.findBySection("unknown")).thenReturn(Optional.empty());
        ResponseEntity<?> resp = controller.getModalTexts("unknown");
        assertEquals(200, resp.getStatusCodeValue());
    }
}
