package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.ModalTextsRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Optional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.BDDMockito.*;

@WebMvcTest(ModalTextsController.class)
class ModalTextsControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ModalTextsRepository repository;

    @Test
    void getModalTexts_ReturnsEmptyIfNotFound() throws Exception {
        given(repository.findBySection("unknown")).willReturn(Optional.empty());
        mockMvc.perform(get("/api/modals/unknown"))
                .andExpect(status().isOk());
    }
}
