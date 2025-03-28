package com.app.vaxms_server.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class VNPayConfig {
    public static String vnp_PayUrl = "";
    public static String vnp_TmnCode = "";
    public static String vnp_HashSecret = "";
    public static String vnp_apiUrl = "";

    public static String getRandomNumber(int len) {
        Random rand = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rand.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("x-forwarded-for");
            if(ipAddress == null) {
                ipAddress = request.getLocalAddr();
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP Address:" + e.getMessage();
        }

        return ipAddress;
    }
}
