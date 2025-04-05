package com.app.vaxms_server.dto.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomerSchedule {
    private Long id;
    private String healthStatusBefore;
    private String healthStatusAfter;
    private String status;
}
