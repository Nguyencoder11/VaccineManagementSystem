package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Nurse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Long> {
    @Query()
    public Page<Nurse> getNurse(@Param("q") String q, Pageable pageable);
}
