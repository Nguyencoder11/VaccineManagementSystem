package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Vaccine;
import com.app.vaxms_server.entity.VaccineInventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaccineInventoryRepository extends JpaRepository<VaccineInventory, Long> {
    Optional<VaccineInventory> findByVaccine(Vaccine vaccine);

    @Query("select vi from VaccineInventory vi  join  Vaccine v on v.id = vi.vaccine.id where v.id = ?1")
    Optional<VaccineInventory> findByVaccineId(Long vaccineId);
    Page<VaccineInventory> findAll(Specification<VaccineInventory> spec, Pageable pageable);
}
