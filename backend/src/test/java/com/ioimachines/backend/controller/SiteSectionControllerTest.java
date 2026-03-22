package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.SiteSectionRepository;
import com.ioimachines.backend.util.AdminSessionStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;
import java.util.Optional;

@WebMvcTest(SiteSectionController.class)
class SiteSectionControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private SiteSectionRepository repo;
    @MockBean
    private AdminSessionStore sessionStore;

    @Test
    void get_NotFound() throws Exception {
        given(repo.findByKey("missing")).willReturn(Optional.empty());
        mockMvc.perform(get("/api/sections/missing"))
                .andExpect(status().isNotFound());
    }
}
