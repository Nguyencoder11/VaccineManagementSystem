package com.app.vaxms_server.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorDto {
    Long id;
    String specialization;
    Integer experienceYears;
    String bio;
    Timestamp createdDate;
    String fullName;
    String avatar;
}
