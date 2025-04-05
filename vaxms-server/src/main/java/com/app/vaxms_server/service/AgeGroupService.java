package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.AgeGroup;
import com.app.vaxms_server.repository.AgeGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgeGroupService {
    @Autowired
    private AgeGroupRepository ageGroupRepository;

    public List<AgeGroup> getAll() {
        return ageGroupRepository.findAll();
    }
}
