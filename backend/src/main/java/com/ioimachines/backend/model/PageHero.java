package com.ioimachines.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "page_heros", uniqueConstraints = {@UniqueConstraint(columnNames = {"page_key"})})
public class PageHero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_key", nullable = false)
    private String key;

    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "alt_text")
    private String altText;

    private Instant createdAt = Instant.now();

    public PageHero() {}

    public PageHero(String key, String title, String imageUrl, String altText) {
        this.key = key;
        this.title = title;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
