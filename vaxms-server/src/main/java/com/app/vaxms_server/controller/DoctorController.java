package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.DoctorDto;
import com.app.vaxms_server.entity.Doctor;
import com.app.vaxms_server.repository.DoctorRepository;
import com.app.vaxms_server.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin
public class DoctorController {
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private DoctorService doctorService;

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAll() {
        List<Doctor> result = doctorRepository.findAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    /* -------------- ADMIN -------------- */

    /* Get list doctor */
    @GetMapping("/admin/list-doctor")
    public ResponseEntity<?> findAllDoctor(@RequestParam(required = false) String q, Pageable pageable) {
        Page<DoctorDto> result = doctorService.getDoctors(q, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /* Update doctor */
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateCustomerProfile(@PathVariable("id") Long id, @RequestBody Doctor doctor) {
        DoctorDto updateDoctor = doctorService.updateDoctor(id, doctor);
        return new ResponseEntity<>(updateDoctor, HttpStatus.OK);
    }

    /* Delete a doctor */
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable("id") Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
