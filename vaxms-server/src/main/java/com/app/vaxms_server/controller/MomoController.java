package com.app.vaxms_server.controller;

import com.app.vaxms_server.config.Environment;
import com.app.vaxms_server.constant.LogUtils;
import com.app.vaxms_server.constant.RequestType;
import com.app.vaxms_server.dto.PaymentDto;
import com.app.vaxms_server.dto.ResponsePayment;
import com.app.vaxms_server.dto.response.PaymentResponse;
import com.app.vaxms_server.entity.VaccineSchedule;
import com.app.vaxms_server.entity.VaccineScheduleTime;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.processor.CreateOrderMoMo;
import com.app.vaxms_server.repository.CustomerScheduleRepository;
import com.app.vaxms_server.repository.VaccineScheduleTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/momo")
@CrossOrigin
public class MomoController {
    @Autowired
    private VaccineScheduleTimeRepository vaccineScheduleTimeRepository;

    @Autowired
    private CustomerScheduleRepository customerScheduleRepository;

    @PostMapping("/create-url-payment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto) {
        LogUtils.init();
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
        String requestId = String.valueOf(System.currentTimeMillis());
        Environment environment = Environment.selectEnv("dev");
        PaymentResponse captureATMMoMoResponse = null;
        try {
            captureATMMoMoResponse = CreateOrderMoMo.process(environment, orderId, requestId, Long.toString(td), paymentDto.getContent(), paymentDto.getReturnUrl(), paymentDto.getNotifyUrl(), "", RequestType.PAY_WITH_ATM, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("url ====: " + captureATMMoMoResponse.getPayUrl());
        ResponsePayment responsePayment = new ResponsePayment(captureATMMoMoResponse.getPayUrl(), orderId, requestId);
        return responsePayment;
    }
}
