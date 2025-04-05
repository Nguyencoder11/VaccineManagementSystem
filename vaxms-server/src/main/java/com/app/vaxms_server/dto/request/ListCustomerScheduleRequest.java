package com.app.vaxms_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ListCustomerScheduleRequest {
    private Long vaccineScheduleId;
    private String status;
    private String fullName;
    private int page;
    private int limit;
}
