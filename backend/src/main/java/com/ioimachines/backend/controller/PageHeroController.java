package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.PageHero;
import com.ioimachines.backend.repository.PageHeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/page-heros")
public class PageHeroController {
    @Autowired
    private PageHeroRepository pageHeroRepository;

    @GetMapping("/{key}")
    public ResponseEntity<?> getByKey(@PathVariable String key) {
        Optional<PageHero> hero = pageHeroRepository.findByKey(key);
        return hero.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{key}")
    public ResponseEntity<?> updateByKey(@PathVariable String key, @RequestBody Map<String, Object> payload) {
        String title = (String) payload.getOrDefault("title", "");
        String imageUrl = (String) payload.getOrDefault("imageUrl", "");
        String altText = (String) payload.getOrDefault("altText", "");
        Optional<PageHero> existing = pageHeroRepository.findByKey(key);
        PageHero hero = existing.orElseGet(() -> new PageHero(key, title, imageUrl, altText));
        hero.setTitle(title);
        hero.setImageUrl(imageUrl);
        hero.setAltText(altText);
        pageHeroRepository.save(hero);
        return ResponseEntity.ok(hero);
    }
}
