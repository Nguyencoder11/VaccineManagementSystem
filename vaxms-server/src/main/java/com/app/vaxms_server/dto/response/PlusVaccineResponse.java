package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.entity.AgeGroup;
import com.app.vaxms_server.entity.Manufacturer;
import com.app.vaxms_server.entity.VaccineType;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlusVaccineResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Integer price;
    private Integer inventory;
    private String status;
    private Timestamp createdDate;
    private VaccineType vaccineType;
    private Manufacturer manufacturer;
    private AgeGroup ageGroup;
}
