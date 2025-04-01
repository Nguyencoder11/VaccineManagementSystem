package com.app.vaxms_server.dto;

import com.app.vaxms_server.enums.PayType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private String orderId;
    private String requestId;
    private String vnpOrderInfo;
    private String vnpayUrl;
    private PayType payType;
}
