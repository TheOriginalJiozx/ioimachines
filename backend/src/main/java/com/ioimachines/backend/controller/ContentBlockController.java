package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.ContentBlockRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin
public class ContentBlockController {

    private final ContentBlockRepository repository;

    public ContentBlockController(ContentBlockRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String,Object>> list() {
        return repository.findAllByOrderBySortOrderAsc().stream().map(callback -> {
            Map<String,Object> mm = new java.util.HashMap<>();
            mm.put("id", callback.id);
            mm.put("key", callback.blockKey);
            mm.put("body", callback.body);
            mm.put("sort_order", callback.sortOrder);
            mm.put("icon", callback.icon);
            return mm;
        }).collect(Collectors.toList());
    }
}
