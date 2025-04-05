package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.VaccineScheduleNurse;
import com.app.vaxms_server.repository.VaccineScheduleNurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccineScheduleNurseService {
    @Autowired
    private VaccineScheduleNurseRepository vaccineScheduleNurseRepository;

    public List<VaccineScheduleNurse> findBySchedule(Long scheduleId) {
        return vaccineScheduleNurseRepository.findBySchedule(scheduleId);
    }

    public void delete(Long id) {
        vaccineScheduleNurseRepository.deleteById(id);
    }
}
