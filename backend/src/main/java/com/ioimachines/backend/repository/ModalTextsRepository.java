package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.ModalTexts;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ModalTextsRepository extends JpaRepository<ModalTexts, Long> {
    Optional<ModalTexts> findBySection(String section);
}
