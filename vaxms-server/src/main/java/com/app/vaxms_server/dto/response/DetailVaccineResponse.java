package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.entity.AgeGroup;
import com.app.vaxms_server.entity.Manufacturer;
import com.app.vaxms_server.entity.VaccineType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetailVaccineResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Integer price;
    private Integer inventory;
    private Timestamp createdDate;
    private String status;
    private VaccineType vaccineType;
    private Manufacturer manufacturer;
    private AgeGroup ageGroup;
}
