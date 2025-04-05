package com.app.vaxms_server.service;

import com.app.vaxms_server.dto.NurseDto;
import com.app.vaxms_server.entity.Nurse;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.NurseRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class NurseService {
    @Autowired
    private NurseRepository nurseRepository;

    public List<Nurse> findAll() {
        return nurseRepository.findAll();
    }

    public Page<NurseDto> getNurse(String q, Pageable pageable) {
        Page<Nurse> nurses = nurseRepository.getNurse(q, pageable);
        return nurses.map(this::mapToDTO);
    }

    public void deleteNurse(Long id) {
        Optional<Nurse> nurse = nurseRepository.findById(id);
        if(nurse.isPresent()) {
            nurseRepository.delete(nurse.get());
        } else {
            throw new MessageException("Y tá không tìm thấy !");
        }
    }

    public NurseDto updateNurse(Long id, Nurse nurseUpdate) {
        Optional<Nurse> nurseExist = nurseRepository.findById(id);

        if (nurseExist.isPresent()) {
            Nurse nurse = nurseExist.get();

            nurse.setAvatar(nurseUpdate.getAvatar());
            nurse.setFullName(nurseUpdate.getFullName());
            nurse.setExperienceYears(nurseUpdate.getExperienceYears());
            nurse.setQualification(nurseUpdate.getQualification());
            nurse.setBio(nurseUpdate.getBio());

            Nurse result = nurseRepository.save(nurse);
            return mapToDTO(result);
        } else {
            throw new MessageException("Bác sĩ không tồn tại ! ");
        }
    }

    private NurseDto mapToDTO(Nurse nurse) {
        NurseDto dto = new NurseDto();
        BeanUtils.copyProperties(nurse, dto);
        return dto;
    }
}
