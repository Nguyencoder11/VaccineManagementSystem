package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.Doctor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin
public class DoctorController {

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAll() {
//        List<Doctor> result = ;
    }


    /* -------------- ADMIN -------------- */

    /* Get list doctor */
    @GetMapping("/admin/list-doctor")
    public ResponseEntity<?> findAllDoctor(@RequestParam(required = false) String q, Pageable pageable) {

    }

    /* Update doctor */
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateCustomerProfile(@PathVariable("id") Long id, @RequestBody Doctor doctor) {

    }

    /* Delete a doctor */
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable("id") Long id) {

    }
}
