package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.CustomerProfileDto;
import com.app.vaxms_server.entity.CustomerProfile;
import com.app.vaxms_server.service.CustomerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-profile")
@CrossOrigin
public class CustomerProfileController {
    @Autowired
    private CustomerProfileService customerProfileService;

    @GetMapping("/customer/find-by-user")
    public ResponseEntity<?> findByUser() {
        CustomerProfile result = customerProfileService.findByUser();
        System.out.println("customer: " + result.getId());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/customer/update-profile")
    public ResponseEntity<?> update(@RequestBody CustomerProfile customerProfile) {
        CustomerProfile result = customerProfileService.update(customerProfile);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /*---------------------------- ADMIN ---------------------------*/
    /* Get list customer */
    @GetMapping("/admin/list-customer")
    public ResponseEntity<?> findAllCustomerProfile(@RequestParam(required = false) String q, Pageable pageable) {
        Page<CustomerProfileDto> result = customerProfileService.getCustomers(q, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /* Update customer */
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody CustomerProfile customerProfile) {
        CustomerProfileDto customerUpdate = customerProfileService.updateCustomerProfile(id, customerProfile);
        return new ResponseEntity<>(customerUpdate, HttpStatus.OK);
    }

    /* Delete customer */
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") Long id) {
        customerProfileService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}
