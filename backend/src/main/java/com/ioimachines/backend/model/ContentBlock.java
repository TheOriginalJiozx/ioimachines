package com.ioimachines.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "content_blocks")
public class ContentBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String blockKey;

    @Column(columnDefinition = "TEXT")
    public String body;

    @Column(name = "icon", length = 1024)
    public String icon;

    public Integer sortOrder;

    public ContentBlock() {}
}
