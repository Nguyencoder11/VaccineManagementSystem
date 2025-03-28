package com.app.vaxms_server.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusCustomerSchedule {
    pending,
    confirmed,
    cancelled,
    finished,
    injected,
    not_injected;

    public static StatusCustomerSchedule getStatusCustomerSchedule(String value) {
        for(StatusCustomerSchedule status : StatusCustomerSchedule.values()) {
            if(status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return null;
    }
}
