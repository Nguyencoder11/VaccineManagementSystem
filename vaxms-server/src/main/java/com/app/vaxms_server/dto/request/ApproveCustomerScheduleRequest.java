package com.app.vaxms_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApproveCustomerScheduleRequest {
    public Long customerScheduleId;
    private String status;
}
