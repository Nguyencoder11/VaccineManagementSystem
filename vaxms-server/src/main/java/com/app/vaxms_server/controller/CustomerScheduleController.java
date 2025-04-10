package com.app.vaxms_server.controller;

import com.app.vaxms_server.service.CustomerScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer-schedule")
@CrossOrigin
public class CustomerScheduleController {
    @Autowired
    private CustomerScheduleService customerScheduleService;


}
