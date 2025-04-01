package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsePayment {
    private String url;
    private String orderId;
    private String requestId;
    public ResponsePayment(String url, String orderId, String requestId) {
        this.url = url;
        this.orderId = orderId;
        this.requestId = requestId;
    }
}
