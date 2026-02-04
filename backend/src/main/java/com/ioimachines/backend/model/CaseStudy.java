package com.ioimachines.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "case_studies")
public class CaseStudy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(length = 1024)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String body;

    @Column(length = 2048)
    public String image;

    @Column(length = 1024)
    public String solutionTitle;

    @Column(columnDefinition = "TEXT")
    public String solutionBody;

    @Column(length = 2048)
    public String solutionImage;

    @Column(columnDefinition = "TEXT")
    public String extra;

    public Integer sortOrder;

    public CaseStudy() {}
}
