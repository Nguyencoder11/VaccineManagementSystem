package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.VaccineTypeResponse;
import com.app.vaxms_server.dto.request.*;
import com.app.vaxms_server.entity.Vaccine;
import com.app.vaxms_server.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vaccine")
@CrossOrigin
public class VaccineController {
    @Autowired
    private VaccineService vaccineService;

    @GetMapping("/all/find-all")
    public ResponseEntity<?> findAll(){
        List<Vaccine> vaccineList = vaccineService.findAll();
        return new ResponseEntity<>(vaccineList, HttpStatus.OK);
    }

    @GetMapping("/all/find-by-type")
    public ResponseEntity<?> findByType(@RequestParam Long typeId) {
        List<Vaccine> lists = vaccineService.findByType(typeId);
        return new ResponseEntity<>(lists, HttpStatus.OK);
    }

    @GetMapping("/public/vaccine-type")
    public ResponseEntity<?> findByType() {
        List<VaccineTypeResponse> list = vaccineService.allVaccineType();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/list")
    public ResponseEntity<?> vaccines(@RequestBody ListVaccineRequest request) {
        return new ResponseEntity<>(vaccineService.listVaccine(request), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createVaccine(@RequestBody CreateVaccineRequest request) {
        return  new ResponseEntity<>(vaccineService.createVaccine(request), HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateVaccine(@RequestBody UpdateVaccineRequest request) {
        return new ResponseEntity<>(vaccineService.updateVaccine(request), HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteVaccine(@RequestBody DeleteVaccineRequest request) {
        return new ResponseEntity<>(vaccineService.deleteVaccine(request), HttpStatus.OK);
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detailVaccine(@RequestBody DetailVaccineRequest request) {
        return new ResponseEntity<>(vaccineService.detailVaccine(request), HttpStatus.OK);
    }

    @PostMapping("/import")
    public void importVaccine(MultipartFile file) throws Exception {
        vaccineService.importExcelData(file);
    }

    @PostMapping("/plus")
    public ResponseEntity<?> importVaccine(@RequestBody PlusVaccineRequest request) {
        return new ResponseEntity<>(vaccineService.plusVaccine(request), HttpStatus.OK);
    }

    @GetMapping("/public/search-by-param")
    public ResponseEntity<?> findByParam(@RequestParam(required = false) String search, Pageable pageable) {
        Page<Vaccine> result = vaccineService.findByParam(search, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> findById(@RequestParam Long id) {
        Vaccine result = vaccineService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
