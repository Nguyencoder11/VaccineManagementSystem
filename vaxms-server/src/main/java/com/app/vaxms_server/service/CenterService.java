package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.Center;
import com.app.vaxms_server.repository.CenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CenterService {
    @Autowired
    private CenterRepository centerRepository;

    public List<Center> findAll() {
        return centerRepository.findAll();
    }
}
