package com.app.vaxms_server.dto;

import com.app.vaxms_server.enums.PayType;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class PaymentRequest {
    private String orderId;
    private String requestId;
    private String vnpOrderInfo;
    private String vnpayUrl;
    private PayType payType;
    private String fullName;
    private Date dob;
    private String phone;
    private String address;
    private String note;
}
