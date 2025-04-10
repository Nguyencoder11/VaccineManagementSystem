package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.NurseDto;
import com.app.vaxms_server.entity.Nurse;
import com.app.vaxms_server.service.NurseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin
public class NurseController {
    @Autowired
    private NurseService nurseService;

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAll() {
        List<Nurse> list = nurseService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /*--------------------------- ADMIN ---------------------------*/
    /* Get list nurse */
    @GetMapping("/admin/list-nurse")
    public ResponseEntity<?> findAllNurses(@RequestParam(required = false) String query, Pageable pageable) {
        Page<NurseDto> result = nurseService.getNurse(query, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /* Update nurse */
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateCustomerProfile(@RequestParam("id") Long id, @RequestBody Nurse nurse) {
        NurseDto nurseUpdate = nurseService.updateNurse(id, nurse);
        return new ResponseEntity<>(nurseUpdate, HttpStatus.OK);
    }

    /* Delete nurse */
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        nurseService.deleteNurse(id);
        return ResponseEntity.ok().build();
    }

}
