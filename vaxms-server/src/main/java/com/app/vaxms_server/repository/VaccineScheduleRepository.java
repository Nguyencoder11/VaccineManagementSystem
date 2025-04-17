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
    @Query(value = "select * from vaccine_schedule v where DATE(v.start_date) >= ?1 and DATE(v.end_date) <= ?2", nativeQuery = true)
    Page<VaccineSchedule> findByDate(Date from, Date to, Pageable pageable);

    @Query(value = "select v.* from vaccine_schedule v where v.end_date >= ?2 and v.vaccine_id = ?1 " +
            "and (v.limit_people > " +
            "(select count(cs.id) from customer_schedule cs where cs.vaccine_schedule_id = v.id and cs.status != 'cancelled') )", nativeQuery = true)
    List<VaccineSchedule> findByVaccine(Long vaccineId, LocalDateTime now);

    @Query("select v from VaccineSchedule v where v.vaccine.name like ?1 and v.endDate > ?2")
    Page<VaccineSchedule> findByParam(String param, Date now, Pageable pageable);

    @Query("select v from VaccineSchedule v where v.vaccine.name like ?1 and v.endDate <= ?2")
    Page<VaccineSchedule> preFindByParam(String param, Date now, Pageable pageable);

    @Query("select v from VaccineSchedule v where v.endDate >= ?1 and v.startDate <= ?1 and v.vaccine.id = ?2")
    List<VaccineSchedule> getCenter(Date start, Long vaccineId);

    @Query(value = """
    SELECT v.*
    FROM vaccine_schedule v
    JOIN vaccine vc ON v.vaccine_id = vc.id
    JOIN centers c ON v.center_id = c.center_id
    WHERE (:vaccineName IS NULL OR LOWER(vc.name) LIKE LOWER(CONCAT('%', :vaccineName, '%')))
      AND (:centerName IS NULL OR LOWER(c.center_name) LIKE LOWER(CONCAT('%', :centerName, '%')))
      AND (:fromDate IS NULL OR v.start_date >= CAST(:fromDate AS date))
      AND (:toDate IS NULL OR v.end_date <= CAST(:toDate AS date))
      AND (:status IS NULL
           OR (:status = 'ACTIVE' AND v.start_date <= CURRENT_DATE AND v.end_date >= CURRENT_DATE)
           OR (:status = 'INACTIVE' AND v.end_date < CURRENT_DATE)
           OR (:status = 'UPCOMING' AND v.start_date > CURRENT_DATE))
    ORDER BY v.start_date DESC
""",
            countQuery = """
    SELECT COUNT(*)
    FROM vaccine_schedule v
    JOIN vaccine vc ON v.vaccine_id = vc.id
    JOIN centers c ON v.center_id = c.center_id
    WHERE (:vaccineName IS NULL OR LOWER(vc.name) LIKE LOWER(CONCAT('%', :vaccineName, '%')))
      AND (:centerName IS NULL OR LOWER(c.center_name) LIKE LOWER(CONCAT('%', :centerName, '%')))
      AND (:fromDate IS NULL OR v.start_date >= CAST(:fromDate AS date))
      AND (:toDate IS NULL OR v.end_date <= CAST(:toDate AS date))
      AND (:status IS NULL
           OR (:status = 'ACTIVE' AND v.start_date <= CURRENT_DATE AND v.end_date >= CURRENT_DATE)
           OR (:status = 'INACTIVE' AND v.end_date < CURRENT_DATE)
           OR (:status = 'UPCOMING' AND v.start_date > CURRENT_DATE))
""",
            nativeQuery = true)
    Page<VaccineSchedule> findAdvancedSearch(
            @Param("vaccineName") String vaccineName,
            @Param("centerName") String centerName,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("status") String status,
            Pageable pageable
    );

    @Query(value = "select * from vaccine_schedule v " +
            "inner join vaccine vc on vc.id = v.vaccine_id where vc.name like ?3 and " +
            " DATE(v.start_date) >= ?1 and DATE(v.end_date) <= ?2 ", nativeQuery = true)
    public Page<VaccineSchedule> findByDateAndParam(Date from , Date to, String search, Pageable pageable);

    @Query(value = "select * from vaccine_schedule v " +
            "inner join vaccine vc on vc.id = v.vaccine_id where vc.name like ?1 ", nativeQuery = true)
    Page<VaccineSchedule> findByParam(String s, Pageable pageable);

    @Query("SELECT v FROM VaccineSchedule v WHERE v.vaccine.id = :vaccineId")
    List<VaccineSchedule> findByVaccineId(@Param("vaccineId") Long vaccineId);
}
