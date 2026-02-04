package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.ContentBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {
    List<ContentBlock> findAllByOrderBySortOrderAsc();
}
