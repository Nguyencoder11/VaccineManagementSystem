package com.app.vaxms_server.vnpay;

import org.springframework.stereotype.Service;

@Service
public class VNPayService {
   String vnp_Version = "";
   String vnp_Command = "";
   String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
   String vnp_IpAddr = VNPayConfig.getIpAddress();
   String vnp_TmnCode = VNPayConfig.vnp_TmnCode;


}
