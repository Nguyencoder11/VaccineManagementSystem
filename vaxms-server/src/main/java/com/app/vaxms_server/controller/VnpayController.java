package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.PaymentDto;
import com.app.vaxms_server.dto.ResponsePayment;
import com.app.vaxms_server.entity.VaccineScheduleTime;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.CustomerScheduleRepository;
import com.app.vaxms_server.repository.VaccineScheduleTimeRepository;
import com.app.vaxms_server.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin
public class VnpayController {
    @Autowired
    private VNPayService vnpayService;

    @Autowired
    private VaccineScheduleTimeRepository vaccineScheduleTimeRepository;

    @Autowired
    private CustomerScheduleRepository customerScheduleRepository;

    @PostMapping("/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto) {
        VaccineScheduleTime vaccineScheduleTime = vaccineScheduleTimeRepository.findById(paymentDto.getIdScheduleTime()).get();
        var count = customerScheduleRepository.countBySchedule(vaccineScheduleTime.getId());
        if (count == null) {
            count = 0L;
        }
        if (count + 1 > vaccineScheduleTime.getLimitPeople()) {
            throw new MessageException("Lịch tiêm vaccine đã hết lượt đăng ký");
        }
        Long td = Long.valueOf(vaccineScheduleTime.getVaccineSchedule().getVaccine().getPrice());

        String orderId = String.valueOf(System.currentTimeMillis());
        String vnpayUrl = vnpayService.createOrder(td.intValue(), orderId, paymentDto.getReturnUrl());
        ResponsePayment responsePayment = new ResponsePayment(vnpayUrl, orderId, null);
        return responsePayment;
    }
}
