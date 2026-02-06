package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.CaseStudy;
import com.ioimachines.backend.repository.CaseStudyRepository;
import com.ioimachines.backend.util.AdminSessionStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.text.Normalizer;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/case-studies")
public class CaseStudyController {

    @Autowired
    private CaseStudyRepository repo;
    @Autowired
    private AdminSessionStore sessionStore;

    @GetMapping
    public List<CaseStudy> list() {
        return repo.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        return repo.findBySlug(slug)
            .map(caseStudy -> {
                Map<String, Object> resp = new java.util.HashMap<>();
                resp.put("id", caseStudy.getId());
                resp.put("slug", caseStudy.getSlug());
                resp.put("title", caseStudy.getTitle());
                resp.put("content", caseStudy.getContentJson());
                resp.put("solution_title", caseStudy.getSolutionTitle());
                resp.put("solution_content_json", caseStudy.getSolutionContentJson());
                resp.put("createdAt", caseStudy.getCreatedAt());
                return ResponseEntity.ok(resp);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        String slug = (String) payload.getOrDefault("slug", "");
        String title = (String) payload.getOrDefault("title", "");
        Object content = payload.getOrDefault("content", "");
        String solutionTitle = (String) payload.getOrDefault("solution_title", "");
        Object solutionContent = payload.getOrDefault("solution_content_json", "");
        String contentJson = content instanceof String ? (String) content : (content == null ? "" : content.toString());
        String solutionContentJson = solutionContent instanceof String ? (String) solutionContent : (solutionContent == null ? "" : solutionContent.toString());

        if (slug.isEmpty() || title.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "slug and title required"));

        try {
            CaseStudy caseStudy = new CaseStudy(slug, title, contentJson, solutionTitle, solutionContentJson);
            caseStudy = repo.save(caseStudy);
            return ResponseEntity.created(URI.create("/api/case-studies/" + caseStudy.getSlug())).body(Map.of("ok", true, "slug", caseStudy.getSlug()));
        } catch (DataIntegrityViolationException dive) {
            return ResponseEntity.status(409).body(Map.of("error", "slug already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to save"));
        }
    }

    @PutMapping("/{slug}")
    public ResponseEntity<?> update(@PathVariable String slug,
                                    @RequestHeader(name = "Authorization", required = false) String auth,
                                    @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken,
                                    @RequestBody Map<String, Object> payload) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer ")) token = auth.substring(7);
        if (token == null) token = headerToken;
        Long adminId = sessionStore.validate(token);
        if (adminId == null) return ResponseEntity.status(401).body(Map.of("error", "invalid token"));

        return repo.findBySlug(slug).map(caseStudy -> {
            String title = (String) payload.get("title");
            Object content = payload.getOrDefault("content", payload.get("content_json"));
            String contentJson = content instanceof String ? (String) content : (content == null ? caseStudy.getContentJson() : content.toString());
            String solutionTitle = (String) payload.getOrDefault("solution_title", payload.get("solutionTitle"));
            Object solutionContent = payload.getOrDefault("solution_content_json", payload.get("solutionContentJson"));
            String solutionContentJson = solutionContent instanceof String ? (String) solutionContent : (solutionContent == null ? caseStudy.getSolutionContentJson() : solutionContent.toString());

            if (title != null && !title.equals(caseStudy.getTitle())) {
                String newSlug = slugify(title);
                if (!newSlug.equals(caseStudy.getSlug())) {
                    java.util.Optional<CaseStudy> existing = repo.findBySlug(newSlug);
                    if (existing.isPresent()) {
                        return ResponseEntity.status(409).body(Map.of("error", "slug already exists"));
                    }
                    caseStudy.setSlug(newSlug);
                }
                caseStudy.setTitle(title);
            }

            if (contentJson != null) caseStudy.setContentJson(contentJson);
            if (solutionTitle != null) caseStudy.setSolutionTitle(solutionTitle);
            if (solutionContentJson != null) caseStudy.setSolutionContentJson(solutionContentJson);

            repo.save(caseStudy);
            return ResponseEntity.ok(Map.of("ok", true, "slug", caseStudy.getSlug()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private static String slugify(String input) {
        if (input == null) return "";
        String nowhitespace = input.trim().toLowerCase();
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        normalized = normalized.replaceAll("\\p{M}", "");
        normalized = normalized.replaceAll("[^a-z0-9]+", "-");
        normalized = normalized.replaceAll("-+", "-");
        normalized = normalized.replaceAll("^-|-$", "");
        return normalized.isEmpty() ? "n-a" : normalized;
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<?> delete(@PathVariable String slug,
                                    @RequestHeader(name = "Authorization", required = false) String auth,
                                    @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String headerToken) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer ")) token = auth.substring(7);
        if (token == null) token = headerToken;
        Long adminId = sessionStore.validate(token);
        if (adminId == null) return ResponseEntity.status(401).body(Map.of("error", "invalid token"));

        return repo.findBySlug(slug).map(caseStudy -> {
            repo.delete(caseStudy);
            return ResponseEntity.ok(Map.of("ok", true));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
