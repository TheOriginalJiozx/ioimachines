package com.ioimachines.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "heros")
public class Hero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;

    @Column(name = "subtitle", columnDefinition = "TEXT")
    public String subtitle;

    @Column(name = "image_url")
    public String imageUrl;

    public Hero() {}
}
