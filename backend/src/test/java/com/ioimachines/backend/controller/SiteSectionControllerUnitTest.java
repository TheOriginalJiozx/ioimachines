package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.SiteSectionRepository;
import com.ioimachines.backend.util.AdminSessionStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SiteSectionControllerUnitTest {
    @Mock
    private SiteSectionRepository repo;
    @Mock
    private AdminSessionStore sessionStore;
    @InjectMocks
    private SiteSectionController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void get_NotFound() {
        when(repo.findByKey("missing")).thenReturn(Optional.empty());
        ResponseEntity<?> resp = controller.get("missing");
        assertEquals(404, resp.getStatusCodeValue());
    }
}
