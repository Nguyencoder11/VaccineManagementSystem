package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.Center;
import com.app.vaxms_server.service.CenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/center")
@CrossOrigin
public class CenterController {
    @Autowired
    private CenterService centerService;

    @GetMapping("/public/find-all")
    public ResponseEntity<?> getAll() {
        List<Center> list = centerService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
