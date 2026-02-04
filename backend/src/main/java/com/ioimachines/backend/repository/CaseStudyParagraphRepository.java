package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.CaseStudyParagraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseStudyParagraphRepository extends JpaRepository<CaseStudyParagraph, Long> {
    List<CaseStudyParagraph> findByCaseStudyIdOrderBySortOrderAsc(Long caseStudyId);
}
