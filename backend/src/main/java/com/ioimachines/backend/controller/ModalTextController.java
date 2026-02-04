package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.ModalTextRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modal_texts")
@CrossOrigin
public class ModalTextController {

    private final ModalTextRepository repository;

    public ModalTextController(ModalTextRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String,Object>> list() {
        return repository.findAll().stream().map(modal -> {
            Map<String,Object> mm = new HashMap<>();
            mm.put("id", modal.id);
            mm.put("card_id", modal.cardId);
            mm.put("content", modal.content != null && !modal.content.isEmpty() ? modal.content : null);
            return mm;
        }).collect(Collectors.toList());
    }

    @GetMapping("/card/{cardId}")
    public Map<String,Object> getByCardId(@PathVariable("cardId") Long cardId) {
        return repository.findByCardId(cardId).map(m -> {
            Map<String,Object> mm = new HashMap<>();
            mm.put("id", m.id);
            mm.put("card_id", m.cardId);
            mm.put("content", m.content != null && !m.content.isEmpty() ? m.content : null);
            return mm;
        }).orElseGet(() -> Map.of());
    }
}
