package com.ioimachines.backend.repository;

import com.ioimachines.backend.model.Hero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeroRepository extends JpaRepository<Hero, Long> {
}
