package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDto {
//    private int amount;
    private Long idScheduleTime;
    private String content;
    private String returnUrl;
    private String notifyUrl;
}
