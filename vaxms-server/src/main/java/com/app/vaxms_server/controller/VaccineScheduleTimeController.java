package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.ScheduleTimeDto;
import com.app.vaxms_server.dto.VaccineScheduleTimeResponse;
import com.app.vaxms_server.entity.VaccineScheduleTime;
import com.app.vaxms_server.service.VaccineScheduleTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/vaccine-schedule-time")
@CrossOrigin
public class VaccineScheduleTimeController {
    @Autowired
    private VaccineScheduleTimeService vaccineScheduleTimeService;

    @PostMapping("/admin/create-multiple")
    public ResponseEntity<?> createByAdmin(@RequestBody ScheduleTimeDto scheduleTimeDto) {
        List<VaccineScheduleTime> result = vaccineScheduleTimeService.createMulti(scheduleTimeDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> create(@RequestBody VaccineScheduleTime vaccineScheduleTime) {
        VaccineScheduleTime result = vaccineScheduleTimeService.save(vaccineScheduleTime);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody VaccineScheduleTime vaccineScheduleTime) {
        VaccineScheduleTime result = vaccineScheduleTimeService.update(vaccineScheduleTime);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/all/find-by-schedule")
    public ResponseEntity<?> findByVaccine(@RequestParam Long idSchedule) {
        List<VaccineScheduleTime> result = vaccineScheduleTimeService.findBySchedule(idSchedule);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete")
    public void delete(@RequestParam("id") Long id) {
        vaccineScheduleTimeService.delete(id);
    }

    @GetMapping("/public/find-date-by-vaccine-schedule")
    public ResponseEntity<?> getDate(@RequestParam Long idSchedule) {
        Set<Date> result = vaccineScheduleTimeService.findDateBySchedule(idSchedule);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-time-by-vaccine-schedule")
    public ResponseEntity<?> getTime(@RequestParam Long idSchedule, @RequestParam Date date) {
        List<VaccineScheduleTimeResponse> result = vaccineScheduleTimeService.findTimeBySchedule(idSchedule, date);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> findById(@RequestParam Long id) {
        VaccineScheduleTime result = vaccineScheduleTimeService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
