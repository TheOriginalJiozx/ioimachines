package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.PageHeroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PageHeroControllerUnitTest {
    @Mock
    private PageHeroRepository pageHeroRepository;
    @InjectMocks
    private PageHeroController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void getByKey_NotFound() {
        when(pageHeroRepository.findByKey("missing")).thenReturn(Optional.empty());
        ResponseEntity<?> resp = controller.getByKey("missing");
        assertEquals(404, resp.getStatusCodeValue());
    }
}
