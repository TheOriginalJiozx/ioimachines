package com.ioimachines.backend.controller;

import com.ioimachines.backend.repository.CaseStudyRepository;
import com.ioimachines.backend.repository.CaseStudyParagraphRepository;
import com.ioimachines.backend.model.CaseStudyParagraph;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/case_studies")
@CrossOrigin
public class CaseStudyController {

    private final CaseStudyRepository caseStudyRepository;
    private final CaseStudyParagraphRepository paragraphRepository;

    public CaseStudyController(CaseStudyRepository caseStudyRepository, CaseStudyParagraphRepository paragraphRepository) {
        this.caseStudyRepository = caseStudyRepository;
        this.paragraphRepository = paragraphRepository;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return caseStudyRepository.findAllByOrderBySortOrderAsc().stream().map(caseStudy -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", caseStudy.id);
            m.put("title", caseStudy.title);
            m.put("body", caseStudy.body);
            m.put("image", caseStudy.image);
            m.put("solution_title", caseStudy.solutionTitle);
            m.put("solution_body", caseStudy.solutionBody);
            m.put("solution_image", caseStudy.solutionImage);
            m.put("extra", caseStudy.extra);
            List<CaseStudyParagraph> paras = paragraphRepository.findByCaseStudyIdOrderBySortOrderAsc(caseStudy.id);
            m.put("paragraphs", paras.stream().map(p -> p.body).collect(Collectors.toList()));
            m.put("sort_order", caseStudy.sortOrder);
            return m;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String,Object> getById(@PathVariable("id") Long id) {
        return caseStudyRepository.findById(id).map(caseStudy -> {
            Map<String,Object> m = new HashMap<>();
            m.put("id", caseStudy.id);
            m.put("title", caseStudy.title);
            m.put("body", caseStudy.body);
            m.put("image", caseStudy.image);
            m.put("solution_title", caseStudy.solutionTitle);
            m.put("solution_body", caseStudy.solutionBody);
            m.put("solution_image", caseStudy.solutionImage);
            m.put("extra", caseStudy.extra);
            List<CaseStudyParagraph> paras = paragraphRepository.findByCaseStudyIdOrderBySortOrderAsc(caseStudy.id);
            m.put("paragraphs", paras.stream().map(p -> p.body).collect(Collectors.toList()));
            m.put("sort_order", caseStudy.sortOrder);
            return m;
        }).orElseGet(() -> Map.of());
    }
}
