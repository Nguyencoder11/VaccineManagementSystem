package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.VaccineScheduleTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface VaccineScheduleTimeRepository extends JpaRepository<VaccineScheduleTime, Long> {
    @Query()
    List<VaccineScheduleTime> findByVaccineSchedule(Long vaccineSchedule);

    @Query()
    Set<Date> findDateByVaccineSchedule(Long vaccineSchedule, Date date);

    @Query()
    Long quantityBySchedule(Long scheduleId);

    @Query()
    List<VaccineScheduleTimeResponse> findTimeBySchedule(Long idSchedule, Date date);

    VaccineScheduleTime findFirstByVaccineScheduleId(Long idSchedule);
    List<VaccineScheduleTime> findAllByVaccineScheduleId(Long vaccineScheduleId);
}
