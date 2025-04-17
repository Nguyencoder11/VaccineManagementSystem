package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.request.DeleteVaccineInventoryRequest;
import com.app.vaxms_server.dto.request.DeleteVaccineRequest;
import com.app.vaxms_server.dto.request.DetailVaccineRequest;
import com.app.vaxms_server.dto.request.ListVaccineInventoryRequest;
import com.app.vaxms_server.service.VaccineInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/vaccine-inventory")
@CrossOrigin
@RequiredArgsConstructor
public class VaccineInventoryController {
    private final VaccineInventoryService vaccineInventoryService;

    @PostMapping("/import")
    public void importVaccineInventory(MultipartFile file) throws IOException {
        vaccineInventoryService.importExcelData(file);
    }

    @PostMapping("/list")
    public ResponseEntity<?> listVaccineInventory(@RequestBody ListVaccineInventoryRequest request) {
        return new ResponseEntity<>(vaccineInventoryService.listVaccineInventory(request), HttpStatus.OK);
    }

    @PostMapping("/delete")
    public boolean deleteVaccineInventory(@RequestBody DeleteVaccineInventoryRequest request) {
        return vaccineInventoryService.deleteVaccine(request);
    }

    @PostMapping("/detail")
    public ResponseEntity<?> getByVaccine(@RequestBody DetailVaccineRequest request) {
        return new ResponseEntity<>(vaccineInventoryService.getByVaccine(request), HttpStatus.OK);
    }
}
