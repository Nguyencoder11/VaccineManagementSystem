package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.AgeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgeGroupRepository extends JpaRepository<AgeGroup, Long> {
    Optional<AgeGroup> findById(Long id);
    Optional<AgeGroup> findByAgeRange(String ageRange);
}
