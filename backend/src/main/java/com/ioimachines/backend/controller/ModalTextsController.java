package com.ioimachines.backend.controller;

import com.ioimachines.backend.model.ModalTexts;
import com.ioimachines.backend.repository.ModalTextsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import com.ioimachines.backend.model.ModalTextEntry;

@RestController
@RequestMapping("/api/modals")
public class ModalTextsController {
    private final ModalTextsRepository repository;

    public ModalTextsController(ModalTextsRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{section}")
    public ResponseEntity<?> getModalTexts(@PathVariable String section) {
        if ("home".equals(section)) {
            ModalTexts modal = null;
            for (ModalTexts m : repository.findAll()) {
                if (m.getId() != null && m.getId() == 2L)
                    modal = m;
            }
            if (modal == null)
                modal = new ModalTexts(section, new java.util.HashMap<>());
            List<Map.Entry<String, ModalTextEntry>> sorted = new ArrayList<>(modal.getTexts().entrySet());
            sorted.sort(Comparator.comparingInt(e -> e.getValue().getOrderIndex() != null ? e.getValue().getOrderIndex() : Integer.MAX_VALUE));
            List<Object[]> result = new ArrayList<>();
            for (Map.Entry<String, ModalTextEntry> entry : sorted) {
                result.add(new Object[] { entry.getKey(), entry.getValue() });
            }
            return ResponseEntity.ok(result);
        }
        
        return repository.findBySection(section)
                .map(foundModal -> ResponseEntity.ok(foundModal.getTexts()))
                .orElse(ResponseEntity.ok(new java.util.HashMap<>()));
    }

    @PutMapping("/{section}")
    public ResponseEntity<?> updateModalTexts(@PathVariable String section,
            @RequestBody Map<String, ModalTextEntry> texts) {
        for (Map.Entry<String, ModalTextEntry> entry : texts.entrySet()) {
            System.out.println("Saving modal text: key=" + entry.getKey() + ", body="
                    + entry.getValue().getBody().replaceAll("\n", "<NL>"));
        }
        if ("home".equals(section) || "services".equals(section)) {
            
            Long modalId = "home".equals(section) ? 2L : 1L;
            ModalTexts modal = null;
            for (ModalTexts m : repository.findAll()) {
                if (m.getId() != null && m.getId() == modalId)
                    modal = m;
            }
            if (modal == null)
                modal = new ModalTexts(section, new java.util.HashMap<>());
            Map<String, ModalTextEntry> modalTexts = modal.getTexts();
            if (modalTexts == null)
                modalTexts = new java.util.HashMap<>();
            for (Map.Entry<String, ModalTextEntry> entry : texts.entrySet()) {
                ModalTextEntry modalEntry = entry.getValue();
                String newTitle = entry.getKey();
                
                ModalTextEntry existing = modalTexts.get(newTitle);
                if (existing != null && existing.getOrderIndex() != null) {
                    modalEntry.setOrderIndex(existing.getOrderIndex());
                }
                modalTexts.put(newTitle, modalEntry);
            }
            modal.setTexts(modalTexts);
            repository.save(modal);
            return ResponseEntity.ok().build();
        }
        
        ModalTexts modal = repository.findBySection(section).orElse(new ModalTexts(section, new java.util.HashMap<>()));
        Map<String, ModalTextEntry> currentTexts = modal.getTexts();
        if (currentTexts == null)
            currentTexts = new java.util.HashMap<>();
        for (Map.Entry<String, ModalTextEntry> entry : texts.entrySet()) {
            currentTexts.put(entry.getKey(), entry.getValue());
        }
        modal.setTexts(currentTexts);
        repository.save(modal);
        return ResponseEntity.ok().build();
    }
}
