package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.PageHero;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface PageHeroRepository extends JpaRepository<PageHero, Long> {
    Optional<PageHero> findByKey(String key);
}
