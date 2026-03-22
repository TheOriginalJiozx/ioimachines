package com.ioimachines.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UploadController.class)
class UploadControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void uploadFile_MissingFile() throws Exception {
        mockMvc.perform(multipart("/api/uploads"))
                .andExpect(status().isBadRequest());
    }
}
