package com.app.vaxms_server.controller;

import com.app.vaxms_server.service.AgeGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/age-group")
@CrossOrigin
public class AgeGroupController {
    @Autowired
    private AgeGroupService ageGroupService;


}
