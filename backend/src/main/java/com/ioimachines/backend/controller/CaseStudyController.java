package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.CaseStudy;
import com.ioimachines.backend.repository.CaseStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/case-studies")
public class CaseStudyController {

    @Autowired
    private CaseStudyRepository repo;

    @GetMapping
    public List<CaseStudy> list() {
        return repo.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        return repo.findBySlug(slug)
                .map(c -> ResponseEntity.ok(Map.of(
                        "id", c.getId(),
                        "slug", c.getSlug(),
                        "title", c.getTitle(),
                        "content", c.getContentJson(),
                        "createdAt", c.getCreatedAt()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        String slug = (String) payload.getOrDefault("slug", "");
        String title = (String) payload.getOrDefault("title", "");
        String heroImage = (String) payload.getOrDefault("heroImage", "");
        Object content = payload.getOrDefault("content", "");
        String contentJson = content instanceof String ? (String) content : (content == null ? "" : content.toString());

        if (slug.isEmpty() || title.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "slug and title required"));

        try {
            CaseStudy cs = new CaseStudy(slug, title, heroImage, contentJson);
            cs = repo.save(cs);
            return ResponseEntity.created(URI.create("/api/case-studies/" + cs.getSlug())).body(Map.of("ok", true, "slug", cs.getSlug()));
        } catch (DataIntegrityViolationException dive) {
            return ResponseEntity.status(409).body(Map.of("error", "slug already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to save"));
        }
    }
}
