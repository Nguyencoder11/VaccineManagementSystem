package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.Manufacturer;
import com.app.vaxms_server.repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManufacturerService {
    @Autowired
    private ManufacturerRepository manufacturerRepository;
    public List<Manufacturer> getAll() {
        return manufacturerRepository.findAll();
    }
}
