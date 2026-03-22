package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.PageHeroRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;
import java.util.Optional;

@WebMvcTest(PageHeroController.class)
class PageHeroControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PageHeroRepository pageHeroRepository;

    @Test
    void getByKey_NotFound() throws Exception {
        given(pageHeroRepository.findByKey("missing")).willReturn(Optional.empty());
        mockMvc.perform(get("/api/page-heros/missing"))
                .andExpect(status().isNotFound());
    }
}
