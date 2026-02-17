package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.SiteSection;
import com.ioimachines.backend.repository.SiteSectionRepository;
import com.ioimachines.backend.util.AdminSessionStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/sections")
public class SiteSectionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SiteSectionController.class);

    @Autowired
    private SiteSectionRepository repo;
    @Autowired
    private AdminSessionStore sessionStore;

    @GetMapping("/{key}")
    public ResponseEntity<?> get(@PathVariable String key) {
        return repo.findByKey(key).map(s -> {
            return ResponseEntity.ok(Map.of(
                "id", s.getId(),
                "key", s.getKey(),
                "title", s.getTitle(),
                "content", s.getContentJson(),
                "email", s.getEmailJson(),
                "phone", s.getPhoneJson(),
                "address", s.getAddressJson(),
                "timing", s.getTimingJson(),
                "createdAt", s.getCreatedAt()
            ));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{key}")
    public ResponseEntity<?> update(@PathVariable String key,
                                    @RequestHeader(name = "Authorization", required = false) String auth,
                                    @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken,
                                    @RequestBody Map<String,Object> payload) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer ")) token = auth.substring(7);
        if (token == null) token = headerToken;
        if (token == null && payload != null) {
            Object bodyToken = payload.getOrDefault("adminToken", payload.get("token"));
            if (bodyToken instanceof String) token = (String) bodyToken;
        }
        Long adminId = sessionStore.validate(token);
        LOGGER.info("PUT /api/sections/{} called - token present={} adminId={}", key, token != null, adminId);
        LOGGER.info("Payload keys: {}", payload == null ? null : payload.keySet());
        if (adminId == null) return ResponseEntity.status(401).body(Map.of("error","invalid token"));

        String title = (String) payload.getOrDefault("title", null);
        Object content = payload.getOrDefault("content", payload.getOrDefault("contentJson", payload.get("content_json")));
        Object email = payload.getOrDefault("email", payload.getOrDefault("emailJson", payload.get("email_json")));
        Object phone = payload.getOrDefault("phone", payload.getOrDefault("phoneJson", payload.get("phone_json")));
        Object address = payload.getOrDefault("address", payload.getOrDefault("addressJson", payload.get("address_json")));
        Object timing = payload.getOrDefault("timing", payload.getOrDefault("timingJson", payload.get("timing_json")));
        String contentJson = content == null ? null : (content instanceof String ? (String)content : content.toString());
        String emailJson = email == null ? null : (email instanceof String ? (String)email : email.toString());
        String phoneJson = phone == null ? null : (phone instanceof String ? (String)phone : phone.toString());
        String addressJson = address == null ? null : (address instanceof String ? (String)address : address.toString());
        String timingJson = timing == null ? null : (timing instanceof String ? (String)timing : timing.toString());

        java.util.Optional<SiteSection> existingOpt = repo.findByKey(key);
        if (existingOpt.isPresent()) {
            SiteSection s = existingOpt.get();
            if (title != null) s.setTitle(title);
            if (contentJson != null) s.setContentJson(contentJson);
            if (email != null) s.setEmailJson(email instanceof String ? (String)email : email.toString());
            if (phone != null) s.setPhoneJson(phone instanceof String ? (String)phone : phone.toString());
            if (address != null) s.setAddressJson(address instanceof String ? (String)address : address.toString());
            if (timing != null) s.setTimingJson(timing instanceof String ? (String)timing : timing.toString());
            s = repo.save(s);
            LOGGER.info("Updated SiteSection id={} key={}", s.getId(), s.getKey());
            return ResponseEntity.ok(Map.of("ok", true, "id", s.getId()));
        } else {
            SiteSection s = new SiteSection(
                key,
                title == null ? "" : title,
                contentJson == null ? "" : contentJson,
                emailJson == null ? "" : emailJson,
                phoneJson == null ? "" : phoneJson,
                addressJson == null ? "" : addressJson,
                timingJson == null ? "" : timingJson
            );
            s = repo.save(s);
            LOGGER.info("Created SiteSection id={} key={}", s.getId(), s.getKey());
            return ResponseEntity.created(URI.create("/api/sections/"+s.getKey())).body(Map.of("ok", true));
        }
    }
}
