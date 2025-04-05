package com.app.vaxms_server.dto.request;

import com.app.vaxms_server.constant.Language;

public class Request {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private Language language = Language.EN;
    private long startTime;

    public Request() {
        this.startTime = System.currentTimeMillis();
    }

    public Request(String partnerCode, String orderId, String requestId, Language language) {
        this.partnerCode = partnerCode;
        this.orderId = orderId;
        this.requestId = requestId;
        this.language = language;
        this.startTime = System.currentTimeMillis();
    }

    public String getPartnerCode() {
        return partnerCode;
    }

    public void setPartnerCode(String partnerCode) {
        this.partnerCode = partnerCode;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }
}
