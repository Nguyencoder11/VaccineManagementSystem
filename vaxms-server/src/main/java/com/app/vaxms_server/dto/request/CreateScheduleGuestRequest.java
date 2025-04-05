package com.app.vaxms_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateScheduleGuestRequest {
    private Long vaccineScheduleId;
    private String email;
    private String phone;
    private String fullName;
    private String address;
}
