package com.app.vaxms_server.dto.response;

import com.app.vaxms_server.constant.ConfirmRequestType;

public class ConfirmResponse extends Response{
    private Long amount;
    private Long transId;
    private String requestId;
    private ConfirmRequestType requestType;
}
