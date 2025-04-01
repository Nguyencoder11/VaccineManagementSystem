package com.app.vaxms_server.dto;

import com.app.vaxms_server.entity.CustomerSchedule;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerScheduleVnpay {
    private CustomerSchedule customerSchedule;

    private String vnpOrderInfo;

    private String vnpayUrl;
}
