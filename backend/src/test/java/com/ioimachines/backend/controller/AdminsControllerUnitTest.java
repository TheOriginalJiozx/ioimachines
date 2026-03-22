package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.Admins;
import com.ioimachines.backend.repository.AdminRepository;
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

class AdminsControllerUnitTest {
    @Mock
    private AdminRepository adminRepository;
    @Mock
    private AdminSessionStore sessionStore;
    @InjectMocks
    private AdminsController controller;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void getAdmin_NotFound() {
        when(adminRepository.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<Admins> resp = controller.getAdmin(1L);
        assertEquals(404, resp.getStatusCodeValue());
    }
}
