package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.WorkSchedule;
import com.app.vaxms_server.service.WorkScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-schedules")
public class WorkScheduleController {
    @Autowired
    private WorkScheduleService workScheduleService;

    @PostMapping("/create")
    public ResponseEntity<WorkSchedule> createSchedule(@RequestBody WorkSchedule workSchedule) {
        WorkSchedule createSchedule = workScheduleService.createSchedule(workSchedule);
        return ResponseEntity.ok(createSchedule);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<WorkSchedule>> getScheduleByDoctorId(@PathVariable Long doctorId) {
        List<WorkSchedule> schedules = workScheduleService.getSchedulesByDoctorId(doctorId);
        return ResponseEntity.ok(schedules);
    }
}
