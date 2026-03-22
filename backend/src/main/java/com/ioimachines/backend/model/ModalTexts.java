package com.ioimachines.backend.model;

import jakarta.persistence.*;
import java.util.Map;
import java.util.HashMap;

@Entity
public class ModalTexts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String section;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "modal_texts_entries", joinColumns = @JoinColumn(name = "modal_texts_id"))
    @MapKeyColumn(name = "title")
    private Map<String, ModalTextEntry> texts = new HashMap<>();

    public ModalTexts() {}

    public ModalTexts(String section, Map<String, ModalTextEntry> texts) {
        this.section = section;
        this.texts = texts;
    }

    public Long getId() { return id; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public Map<String, ModalTextEntry> getTexts() { return texts; }
    public void setTexts(Map<String, ModalTextEntry> texts) { this.texts = texts; }
}
