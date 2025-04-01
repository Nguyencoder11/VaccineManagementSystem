package com.app.vaxms_server.dto;

import com.app.vaxms_server.entity.Vaccine;
import com.app.vaxms_server.entity.VaccineType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class VaccineTypeResponse {
    private VaccineType vaccineType;

    private List<Vaccine> vaccines = new ArrayList<>();
}
