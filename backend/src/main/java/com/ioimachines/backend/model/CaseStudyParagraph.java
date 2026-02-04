package com.ioimachines.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "case_study_paragraphs")
public class CaseStudyParagraph {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long caseStudyId;

    @Column(columnDefinition = "TEXT")
    public String body;

    public Integer sortOrder;

    public CaseStudyParagraph() {}
}
