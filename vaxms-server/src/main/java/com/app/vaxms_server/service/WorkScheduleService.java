package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.WorkSchedule;
import com.app.vaxms_server.repository.WorkScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkScheduleService {
    @Autowired
    private WorkScheduleRepository workScheduleRepository;

    public WorkSchedule createSchedule(WorkSchedule workSchedule) {
        return workScheduleRepository.save(workSchedule);
    }

    public List<WorkSchedule> getSchedulesByDoctorId(Long doctorId) {
        return workScheduleRepository.findByDoctorId(doctorId);
    }
}
