package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.VaccineType;
import com.app.vaxms_server.repository.VaccineTypeRepository;
import com.app.vaxms_server.service.VaccineTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccine-type")
@CrossOrigin
public class VaccineTypeController {
    @Autowired
    private VaccineTypeService vaccineTypeService;
    @Autowired
    private VaccineTypeRepository vaccineTypeRepository;

    @GetMapping("/find-all")
    public ResponseEntity<?> getAll() {
        List<VaccineType> result = vaccineTypeService.findAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/find-primary")
    public ResponseEntity<?> getAllPrimary(){
        List<VaccineType> result = vaccineTypeRepository.primaryType();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/find-all-admin")
    public ResponseEntity<?> getAllByAdmin(Pageable pageable){
        Page<VaccineType> result = vaccineTypeRepository.findAllByAdmin(pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/find-by-id")
    public ResponseEntity<?> getAllByAdmin(@RequestParam Long id){
        VaccineType result = vaccineTypeRepository.findById(id).get();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam Long id){
        vaccineTypeRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<?> delete(@RequestBody VaccineType vaccineType){
        vaccineTypeRepository.save(vaccineType);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
