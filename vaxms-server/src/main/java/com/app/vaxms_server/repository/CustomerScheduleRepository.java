package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.CustomerSchedule;
import com.app.vaxms_server.enums.CustomerSchedulePay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerScheduleRepository extends JpaRepository<CustomerSchedule, Long> {
    @Query()
    Page<CustomerSchedule> findByUser(Long userId, String search, Date from, Date to, Pageable pageable);

    @Query()
    Long countRegis(Long vaccineScheduleId);

    Page<CustomerSchedule> findAll(Specification<CustomerSchedule> spec, Pageable pageable);

    @Query()
    Long countBySchedule(Long id);

    @Query()
    List<CustomerSchedule> findByCreatedDateAfter(Timestamp createdDate, CustomerSchedulePay customerSchedulePay);

    @Query()
    List<CustomerSchedule> findByVaccineSchedule(Long id);

    @Query()
    List<CustomerSchedule> findByVaccineScheduleAndDate(Long id, Date date, Integer numMonth);

    @Query()
    List<CustomerSchedule> findByInjectDate(@Param("injectDate")LocalDate injectDate);
    long countByVaccineScheduleTime(Long vaccineScheduleTimeId);
}
