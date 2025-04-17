package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.VaccineSchedule;
import com.app.vaxms_server.service.VaccineScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vaccine-schedule")
@CrossOrigin
public class VaccineScheduleController {
    private static final Logger log = LoggerFactory.getLogger(VaccineScheduleController.class);

    @Autowired
    private VaccineScheduleService vaccineScheduleService;

    @PostMapping("/all/find-all")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(vaccineScheduleService.list(), HttpStatus.OK);
    }

    @GetMapping("/all/find-all-page")
    public ResponseEntity<?> getAll(
            @RequestParam(value = "from", required = false)Date from,
            @RequestParam(value = "to", required = false)Date to,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<VaccineSchedule> result = vaccineScheduleService.vaccineSchedules(from, to, search, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/find-by-vaccine")
    public ResponseEntity<?> findByVaccine(@RequestParam Long vaccineId) {
        List<VaccineSchedule> result = vaccineScheduleService.findByVaccine(vaccineId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/find-by-id")
    public ResponseEntity<?> getById(@RequestParam(value = "id") Long id) {
        VaccineSchedule result = vaccineScheduleService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> createByAdmin(@RequestBody VaccineSchedule vaccineSchedule) {
        VaccineSchedule result = vaccineScheduleService.save(vaccineSchedule);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody VaccineSchedule vaccineSchedule) {
        VaccineSchedule result = vaccineScheduleService.update(vaccineSchedule);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public void delete(@RequestParam("id") Long id) {
        vaccineScheduleService.delete(id);
    }

    @GetMapping("/public/next-schedule")
    public ResponseEntity<?> nextSchedule(Pageable pageable, @RequestParam(required = false) String param) {
        Page<VaccineSchedule> result = vaccineScheduleService.nextSchedule(param, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/pre-schedule")
    public ResponseEntity<?> prSchedule(Pageable pageable, @RequestParam(required = false) String param) {
        Page<VaccineSchedule> result = vaccineScheduleService.preSchedule(param, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        VaccineSchedule result = vaccineScheduleService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/get-center")
    public ResponseEntity<?> getCenter(@RequestParam Date start, @RequestParam Long vaccineId) {
        List<VaccineSchedule> result = vaccineScheduleService.getCenter(start, vaccineId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/search-advanced")
    public ResponseEntity<?> searchAdvanced(
            @RequestParam(value = "fromDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")LocalDate fromDate,
            @RequestParam(value = "toDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")LocalDate toDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "vaccineName", required = false) String vaccineName,
            @RequestParam(value = "centerName", required = false) String centerName,
            @RequestParam(value = "status", required = false) String status
            ){
        log.info("Controller Layer - fromDate: {}, toDate: {}, status: {}", fromDate, toDate, status);

        Pageable pageable = PageRequest.of(page, size);
        Page<VaccineSchedule> result = vaccineScheduleService.advancedSearch(
                vaccineName,
                centerName,
                fromDate,
                toDate,
                status,
                pageable
        );
        return ResponseEntity.ok(result);
    }
}
