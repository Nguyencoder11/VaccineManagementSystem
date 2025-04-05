package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.entity.VaccineScheduleTime;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateScheduleGuestResponse {
    private Long id;
    private VaccineScheduleTime vaccineScheduleTime;
    private User user;
    private Boolean payStatus;
    private String status;
    private Timestamp createdDate;
    private String fullName;
}
