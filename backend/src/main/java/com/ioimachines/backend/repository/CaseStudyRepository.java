package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.CaseStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseStudyRepository extends JpaRepository<CaseStudy, Long> {
    List<CaseStudy> findAllByOrderBySortOrderAsc();
}
