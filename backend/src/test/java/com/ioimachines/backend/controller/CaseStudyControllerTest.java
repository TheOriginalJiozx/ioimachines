package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.CaseStudy;
import com.ioimachines.backend.repository.CaseStudyRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.List;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;

@WebMvcTest(CaseStudyController.class)
class CaseStudyControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CaseStudyRepository repo;
    @MockBean
    private com.ioimachines.backend.util.AdminSessionStore sessionStore;

    @Test
    void list_ReturnsAllCaseStudies() throws Exception {
        CaseStudy cs = new CaseStudy();
        cs.setId(1L);
        given(repo.findAll()).willReturn(List.of(cs));
        mockMvc.perform(get("/api/case-studies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getBySlug_ReturnsCaseStudy() throws Exception {
        CaseStudy cs = new CaseStudy();
        cs.setId(1L);
        cs.setSlug("test-slug");
        cs.setTitle("Test");
        cs.setContentJson("{}\n");
        cs.setSolutionTitle("Sol");
        cs.setSolutionContentJson("{}\n");
        given(repo.findBySlug("test-slug")).willReturn(Optional.of(cs));
        mockMvc.perform(get("/api/case-studies/test-slug"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("test-slug"));
    }

    @Test
    void getBySlug_NotFound() throws Exception {
        given(repo.findBySlug("missing")).willReturn(Optional.empty());
        mockMvc.perform(get("/api/case-studies/missing"))
                .andExpect(status().isNotFound());
    }
}
