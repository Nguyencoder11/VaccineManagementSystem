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
    @Query("select c from CustomerSchedule c where c.user.id = ?1 and c.vaccineScheduleTime.vaccineSchedule.vaccine.name like ?2 and " +
            "c.vaccineScheduleTime.injectDate >= ?3 and c.vaccineScheduleTime.injectDate <= ?4")
    Page<CustomerSchedule> findByUser(Long userId, String search, Date from, Date to, Pageable pageable);

    @Query(value = "select count(cs.id) from customer_schedule cs WHERE cs.vaccine_schedule_id = ?1 and cs.status != 'cancelled'", nativeQuery = true)
    Long countRegis(Long vaccineScheduleId);

    Page<CustomerSchedule> findAll(Specification<CustomerSchedule> spec, Pageable pageable);

    @Query("select count(c.id) from CustomerSchedule c where c.vaccineScheduleTime.id = ?1")
    Long countBySchedule(Long id);

    @Query("SELECT c FROM CustomerSchedule c WHERE c.createdDate > ?1 and c.customerSchedulePay = ?2")
    List<CustomerSchedule> findByCreatedDateAfter(Timestamp createdDate, CustomerSchedulePay customerSchedulePay);

    @Query("select c from CustomerSchedule c where c.vaccineScheduleTime.vaccineSchedule.id = ?1")
    List<CustomerSchedule> findByVaccineSchedule(Long id);

    @Query(value = "select c.* from customer_schedule c inner join vaccine_schedule_time vt on vt.id = c.vaccine_schedule_time_id\n" +
            "where vt.vaccine_schedule_id  = ?1 and vt.inject_date = DATE_SUB(?2, INTERVAL ?3 MONTH)", nativeQuery = true)
    List<CustomerSchedule> findByVaccineScheduleAndDate(Long id, Date date, Integer numMonth);

    @Query("SELECT c FROM CustomerSchedule c WHERE c.vaccineScheduleTime.injectDate = :injectDate")
    List<CustomerSchedule> findByInjectDate(@Param("injectDate")LocalDate injectDate);
    long countByVaccineScheduleTimeId(Long vaccineScheduleTimeId);

    @Query("select count(c.id) from CustomerSchedule c where c.vaccineScheduleTime.vaccineSchedule.vaccine.id = ?1")
    Integer countRegisByVaccine(Long vaccineId);
}
