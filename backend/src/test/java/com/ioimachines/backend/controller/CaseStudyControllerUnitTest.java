package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.CaseStudy;
import com.ioimachines.backend.repository.CaseStudyRepository;
import com.ioimachines.backend.util.AdminSessionStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CaseStudyControllerUnitTest {
    @Mock
    private CaseStudyRepository repo;
    @Mock
    private AdminSessionStore sessionStore;
    @InjectMocks
    private CaseStudyController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void list_ReturnsAllCaseStudies() {
        CaseStudy cs = new CaseStudy();
        cs.setId(1L);
        when(repo.findAll()).thenReturn(List.of(cs));
        List<CaseStudy> result = controller.list();
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void getBySlug_ReturnsNotFound() {
        when(repo.findBySlug("missing")).thenReturn(Optional.empty());
        ResponseEntity<?> resp = controller.getBySlug("missing");
        assertEquals(404, resp.getStatusCodeValue());
    }
}
