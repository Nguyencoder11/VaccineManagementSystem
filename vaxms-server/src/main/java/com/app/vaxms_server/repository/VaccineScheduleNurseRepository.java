package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.VaccineScheduleNurse;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface VaccineScheduleNurseRepository extends JpaRepository<VaccineScheduleNurse, Long> {
    @Modifying
    @Transactional
    @Query("delete from VaccineScheduleNurse p where p.vaccineSchedule.id = ?1 and p.injectDate = ?2")
    int deleteByVaccineSchedule(Long vaccineScheduleId, Date date);

    @Query("select v from VaccineScheduleNurse v where v.vaccineSchedule.id = ?1")
    List<VaccineScheduleNurse> findBySchedule(Long vaccineScheduleId);
}
