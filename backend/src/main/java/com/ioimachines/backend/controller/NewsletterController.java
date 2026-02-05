package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.NewsletterSubscriber;
import com.ioimachines.backend.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriberRepository repo;

    @PostMapping
    public ResponseEntity<?> subscribe(@RequestBody Map<String, Object> payload) {
        String email = payload.getOrDefault("email", "").toString().trim();
        if (email.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));

        if (repo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "You're already subscribed"));
        }

        try {
            NewsletterSubscriber subscriber = new NewsletterSubscriber(email);
            repo.save(subscriber);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(Map.of("error", "You're already subscribed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to subscribe"));
        }
    }
}
