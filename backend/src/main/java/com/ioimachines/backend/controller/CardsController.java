package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.CardRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin
public class CardsController {

    private final CardRepository cardRepository;

    public CardsController(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @GetMapping
    public List<Map<String,Object>> list() {
        return cardRepository.findAllByOrderBySortOrderAsc().stream().map(card -> {
            Map<String,Object> m = new HashMap<>();
            m.put("id", card.id);
            m.put("title", card.title);
            m.put("desc", card.description);
            m.put("icon", card.icon);
            m.put("sort_order", card.sortOrder);
            return m;
        }).collect(Collectors.toList());
    }

    @GetMapping("/order/{order}")
    public Map<String,Object> getByOrder(@PathVariable("order") Integer order) {
        return cardRepository.findBySortOrder(order).map(card -> {
            java.util.Map<String,Object> map = new java.util.HashMap<>();
            map.put("id", card.id);
            map.put("title", card.title);
            map.put("desc", card.description);
            map.put("icon", card.icon);
            map.put("sort_order", card.sortOrder);
            return map;
        }).orElseGet(() -> java.util.Map.of());
    }
}
