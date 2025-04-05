package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.entity.AgeGroup;
import com.app.vaxms_server.entity.Manufacturer;
import com.app.vaxms_server.entity.VaccineType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListVaccineResponse {
    private Long id;
    private String nameVaccine;
    private String description;
    private String image;
    private Integer price;
    private Integer inventory;
    private Timestamp createdDate;
    private Timestamp expirationDate;
    private String status;
    private VaccineType vaccineType;
    private Manufacturer manufacturer;
    private AgeGroup ageGroup;
}
