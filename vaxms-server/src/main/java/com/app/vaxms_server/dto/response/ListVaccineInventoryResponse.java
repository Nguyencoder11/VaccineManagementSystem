package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.entity.Vaccine;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListVaccineInventoryResponse {
    private Long id;
    private Vaccine vaccine;
    private Integer quantity;
    private Timestamp createdDate;
    private String status;
}
