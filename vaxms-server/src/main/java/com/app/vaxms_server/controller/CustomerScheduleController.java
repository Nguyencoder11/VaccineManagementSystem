package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.CustomerScheduleVnpay;
import com.app.vaxms_server.dto.PaymentRequest;
import com.app.vaxms_server.dto.models.UpdateCustomerSchedule;
import com.app.vaxms_server.dto.request.ApproveCustomerScheduleRequest;
import com.app.vaxms_server.dto.request.CreateScheduleGuestRequest;
import com.app.vaxms_server.dto.request.ListCustomerScheduleRequest;
import com.app.vaxms_server.entity.CustomerSchedule;
import com.app.vaxms_server.entity.Payment;
import com.app.vaxms_server.enums.CustomerSchedulePay;
import com.app.vaxms_server.service.CustomerScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;

@RestController
@RequestMapping("/api/customer-schedule")
@CrossOrigin
public class CustomerScheduleController {
    @Autowired
    private CustomerScheduleService customerScheduleService;

    @PostMapping("/customer/create-not-pay")
    public ResponseEntity<?> createNotPay(@RequestBody CustomerSchedule customerSchedule) {
        CustomerSchedule result = customerScheduleService.createNotPay(customerSchedule);
        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @PostMapping("/customer/create-pay")
    public ResponseEntity<?> createVnPay(@RequestBody CustomerScheduleVnpay customerSchedulePay) {
        CustomerSchedule result = customerScheduleService.createVnPay(customerSchedulePay);
        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @PostMapping("/customer/create-momo")
    public ResponseEntity<?> createMomo(@RequestBody CustomerSchedule customerSchedule, @RequestParam String orderId,
                                        @RequestParam String requestId) {
        CustomerSchedule result = customerScheduleService.createMomo(customerSchedule, orderId, requestId);
        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @GetMapping("/customer/my-schedule")
    public ResponseEntity<?> mySchedule(Pageable pageable, @RequestParam(required = false)String search,
                                        @RequestParam(required = false)Date from, @RequestParam(required = false)Date to) {
        Page<CustomerSchedule> result = customerScheduleService.mySchedule(pageable, search, from, to);
        result.forEach(p -> {
            System.out.println(p.getCreatedDate());
        });

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/customer/cancel")
    public ResponseEntity<?> cancel(@RequestParam Long id) {
        customerScheduleService.cancel(id);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/customer/approve")
    public ResponseEntity<?> approve(@RequestBody ApproveCustomerScheduleRequest request) {
        return new ResponseEntity<>(customerScheduleService.approveCustomerSchedule(request), HttpStatus.OK);
    }

    @PostMapping("/customer/create-guest")
    public ResponseEntity<?> createGuest(@RequestBody CreateScheduleGuestRequest request) {
        return new ResponseEntity<>(customerScheduleService.createScheduleGuest(request), HttpStatus.OK);
    }

    @PostMapping("/customer/list")
    public ResponseEntity<?> list(@RequestBody ListCustomerScheduleRequest request) {
        return new ResponseEntity<>(customerScheduleService.listCustomerSchedules(request), HttpStatus.OK);
    }

    @PostMapping("/customer/finish-payment")
    public ResponseEntity<?> finishPayment(@RequestParam Long id, @RequestBody PaymentRequest paymentRequest) {
        customerScheduleService.finishPayment(id, paymentRequest);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/customer/change-schedule")
    public ResponseEntity<?> change(@RequestParam Long id, @RequestParam Long timeId) {
        customerScheduleService.change(id, timeId);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/customer/create-customer-findById-schedule")
    public ResponseEntity<?> createCustomerFindByIdSchedule(@RequestBody CreateScheduleGuestRequest request) {
        return new ResponseEntity<>(customerScheduleService.createScheduleGuest(request), HttpStatus.OK);
    }

    @PostMapping("/customer/update-customer-schedule")
    public ResponseEntity<?> updateCustomerSchedule(@RequestBody UpdateCustomerSchedule request) {
        return new ResponseEntity<>(customerScheduleService.updateCustomerSchedule(request), HttpStatus.OK);
    }
}
