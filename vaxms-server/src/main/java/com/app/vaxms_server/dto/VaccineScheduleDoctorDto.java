package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class VaccineScheduleDoctorDto {
    List<Long> doctorId;

    List<Long> nurseId;

    Date injectDate;

    Long vaccineScheduleId;
}
