package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Vaccine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    @Query("select v from Vaccine v where v.vaccineType.id = ?1")
    List<Vaccine> findByType(Long typeId);

    Optional<Vaccine> findById(Long id);
    Optional<Vaccine> findByName(String name);

    Page<Vaccine> findAll(Specification<Vaccine> spec, Pageable pageable);

    @Query("select v from Vaccine v where v.name like ?1 ")
    Page<Vaccine> findByParam(String search, Pageable pageable);
}
