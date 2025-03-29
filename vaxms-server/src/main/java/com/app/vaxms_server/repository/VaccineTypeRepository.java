package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.VaccineType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaccineTypeRepository extends JpaRepository<VaccineType, Long> {
    Optional<VaccineType> findById(Long id);
    Optional<VaccineType> findByTypeName(String name);
}
