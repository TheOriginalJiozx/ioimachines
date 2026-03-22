package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.AdminRepository;
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

@WebMvcTest(AdminsController.class)
class AdminsControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private AdminRepository adminRepository;
    @MockBean
    private AdminSessionStore sessionStore;

    @Test
    void getAdmin_NotFound() throws Exception {
        given(adminRepository.findById(1L)).willReturn(Optional.empty());
        mockMvc.perform(get("/api/admins/1"))
                .andExpect(status().isNotFound());
    }
}
