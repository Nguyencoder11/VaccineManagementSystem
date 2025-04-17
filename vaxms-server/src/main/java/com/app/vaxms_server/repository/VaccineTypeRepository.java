package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.VaccineType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccineTypeRepository extends JpaRepository<VaccineType, Long> {
    Optional<VaccineType> findById(Long id);
    Optional<VaccineType> findByTypeName(String name);
    @Query("select v from VaccineType v where v.isPrimary = true")
    public List<VaccineType> primaryType();

    @Query("select v from VaccineType v where v.isPrimary <> true")
    public List<VaccineType> findAll();

    @Query("select v from VaccineType v")
    public Page<VaccineType> findAllByAdmin(Pageable pageable);
}

