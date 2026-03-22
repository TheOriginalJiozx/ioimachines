package com.ioimachines.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class UploadControllerUnitTest {
    @InjectMocks
    private UploadController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void uploadFile_MissingFile() {
        ResponseEntity<?> resp = controller.uploadFile(null);
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(((Map<?,?>)resp.getBody()).get("error").toString().contains("file required"));
    }
}
