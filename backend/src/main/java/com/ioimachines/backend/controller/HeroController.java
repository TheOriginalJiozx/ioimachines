package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.HeroRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/heros")
@CrossOrigin
public class HeroController {

    private final HeroRepository repository;

    public HeroController(HeroRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String,Object>> list() {
        return repository.findAll().stream().map(hero -> {
            Map<String,Object> mm = new java.util.HashMap<>();
            mm.put("id", hero.id);
            mm.put("title", hero.title);
            mm.put("subtitle", hero.subtitle);
            mm.put("image_url", hero.imageUrl);
            return mm;
        }).collect(Collectors.toList());
    }
}
