package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.VaccineType;
import com.app.vaxms_server.repository.VaccineTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VaccineTypeService {
    @Autowired
    private VaccineTypeRepository vaccineTypeRepository;

    public List<VaccineType> findAll() {
        List<VaccineType> list = vaccineTypeRepository.findAll();
        return list;
    }
}
