package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.VaccineSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VaccineScheduleRepository extends JpaRepository<VaccineSchedule, Long> {
    @Query()
    Page<VaccineSchedule> findByDate(Date from, Date to, Pageable pageable);

    @Query()
    List<VaccineSchedule> findByVaccine(Long vaccineId, LocalDateTime now);

    @Query()
    Page<VaccineSchedule> findByParam(String param, Date now, Pageable pageable);

    @Query()
    Page<VaccineSchedule> preFindByParam(String param, Date now, Pageable pageable);

    @Query()
    List<VaccineSchedule> getCenter(Date start, Long vaccineId);

    @Query()
    Page<VaccineSchedule> findAdvancedSearch(
            @Param("vaccineName") String vaccineName,
            @Param("centerName") String centerName,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("status") String status,
            Pageable pageable
    );
}
