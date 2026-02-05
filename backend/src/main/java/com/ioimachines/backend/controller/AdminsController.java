package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.Admins;
import com.ioimachines.backend.repository.AdminRepository;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.ioimachines.backend.util.AdminSessionStore;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminsController {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AdminSessionStore sessionStore;

    public AdminsController(AdminRepository adminRepository, AdminSessionStore sessionStore) {
        this.adminRepository = adminRepository;
        this.sessionStore = sessionStore;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admins> getAdmin(@PathVariable Long id) {
        return adminRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return adminRepository.findByEmail(req.email).map(admin -> {
            if (admin.password != null && passwordEncoder.matches(req.password, admin.password)) {

                admin.password = null;
                String token = sessionStore.createSession(admin.id);
                return ResponseEntity.ok(new LoginResponse(token, admin));
            }
            return ResponseEntity.status(401).body("invalid credentials");
        }).orElseGet(() -> ResponseEntity.status(404).body("admin not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name = "Authorization", required = false) String auth,
            @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer "))
            token = auth.substring(7);
        if (token == null)
            token = headerToken;
        Long adminId = sessionStore.validate(token);
        if (adminId == null)
            return ResponseEntity.status(401).body("invalid token");
        return adminRepository.findById(adminId).map(admin -> {
            admin.password = null;

            Map<String, Object> out = new HashMap<>();
            out.put("id", admin.id);
            out.put("email", admin.email);
            out.put("admin", admin.admin);
            return ResponseEntity.ok(out);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader(name = "Authorization", required = false) String auth,
            @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken,
            @RequestBody ChangePassword req) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer "))
            token = auth.substring(7);
        if (token == null)
            token = headerToken;
        Long adminId = sessionStore.validate(token);
        if (adminId == null)
            return ResponseEntity.status(401).body("invalid token");
        return adminRepository.findById(adminId).map(admin -> {
            if (admin.password == null || !passwordEncoder.matches(req.currentPassword, admin.password)) {
                return ResponseEntity.status(400).body("current password incorrect");
            }
            if (req.newPassword == null || req.newPassword.length() < 6) {
                return ResponseEntity.status(400).body("new password too short");
            }
            admin.password = passwordEncoder.encode(req.newPassword);
            adminRepository.save(admin);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestHeader(name = "Authorization", required = false) String auth,
            @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken,
            @RequestBody ChangeEmail req) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer "))
            token = auth.substring(7);
        if (token == null)
            token = headerToken;
        Long adminId = sessionStore.validate(token);
        if (adminId == null)
            return ResponseEntity.status(401).body("invalid token");
        return adminRepository.findById(adminId).map(admin -> {
            if (req.newEmail == null || !req.newEmail.contains("@"))
                return ResponseEntity.status(400).body("invalid email");
            admin.email = req.newEmail;
            adminRepository.save(admin);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class LoginResponse {
        public String token;
        public Admins admin;

        public LoginResponse(String token, Admins admin) {
            this.token = token;
            this.admin = admin;
        }
    }

    public static class ChangePassword {
        public String currentPassword;
        public String newPassword;
    }

    public static class ChangeEmail {
        public String newEmail;
    }
}
