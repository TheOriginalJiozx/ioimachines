package com.ioimachines.backend.controller;

import com.ioimachines.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String contactRecipient;

    @PostMapping("/consultation")
    public ResponseEntity<?> submitConsultation(@RequestBody Map<String, Object> payload) {
        String name = payload.getOrDefault("name", "").toString();
        String from = payload.getOrDefault("email", "").toString();
        String message = payload.getOrDefault("message", "").toString();

        String subject = "Consultation Request from " + (name.isEmpty() ? from : name);
        String body = "Sender: " + from + "\n\n" + message;

        String to = contactRecipient;

        boolean ok = emailService.sendSimpleMessage(to, subject, body, from);
        if (!ok)
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send email"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/contact")
    public ResponseEntity<?> submitContact(@RequestBody Map<String, Object> payload) {
        String name = payload.getOrDefault("name", "").toString();
        String from = payload.getOrDefault("email", "").toString();
        String message = payload.getOrDefault("message", "").toString();

        String subject = "Demo Contact Formular filled by " + (name.isEmpty() ? from : name);
        String body = "Sender: " + from + "\n\n" + message;

        String to = contactRecipient;

        boolean ok = emailService.sendSimpleMessage(to, subject, body, from);
        if (!ok)
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send email"));
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
