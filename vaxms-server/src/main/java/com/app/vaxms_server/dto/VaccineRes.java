package com.app.vaxms_server.dto;

import com.app.vaxms_server.entity.Vaccine;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VaccineRes {
    private Vaccine vaccine;
    private Integer sold;
}
