package com.app.vaxms_server.controller;

import com.app.vaxms_server.service.AgeGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/age-group")
@CrossOrigin
public class AgeGroupController {
    @Autowired
    private AgeGroupService ageGroupService;

    @PostMapping("/find-all")
    public ResponseEntity<?> getAll() {
        return new ResponseEntity<>(ageGroupService.getAll(), HttpStatus.OK);
    }
}
