package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.sql.Timestamp;

@Getter
@Setter
public class NurseDto {
    private Long id;
    private String qualification;
    private Integer experienceYears;
    private String bio;
    private Timestamp createdDate;
    private String fullName;
    private String avatar;
}
