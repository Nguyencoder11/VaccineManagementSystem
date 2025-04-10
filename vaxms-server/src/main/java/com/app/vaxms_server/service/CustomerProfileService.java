package com.app.vaxms_server.service;

import com.app.vaxms_server.dto.CustomerProfileDto;
import com.app.vaxms_server.entity.CustomerProfile;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.CustomerProfileRepository;
import com.app.vaxms_server.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Optional;

@Component
public class CustomerProfileService {
    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private UserUtils userUtils;

    public CustomerProfile findByUser() {
        User user = userUtils.getUserWithAuthority();
        CustomerProfile customerProfile = customerProfileRepository.findByUser(user.getId());
        return customerProfile;
    }

    public CustomerProfile update(CustomerProfile customerProfile) {
        User user = userUtils.getUserWithAuthority();

        CustomerProfile exist = customerProfileRepository.findByUser(user.getId());
        customerProfile.setId(exist.getId());
        customerProfile.setCreatedDate(exist.getCreatedDate()==null ? new Timestamp(System.currentTimeMillis()) : exist.getCreatedDate());
        customerProfile.setUser(user);

        customerProfileRepository.save(customerProfile);
        return customerProfile;
    }

    public Page<CustomerProfileDto> getCustomers(String q, Pageable pageable) {
        Page<CustomerProfile> customers = customerProfileRepository.getCustomerProfile(q, pageable);
        return customers.map(this::mapToDTO);
    }

    public CustomerProfileDto updateCustomerProfile(Long id, CustomerProfile updateProfile) {
        Optional<CustomerProfile> existingProfileOpt = customerProfileRepository.findById(id);
        if(existingProfileOpt.isPresent()) {
            CustomerProfile existingProfile = existingProfileOpt.get();

            existingProfile.setFullName(updateProfile.getFullName());
            existingProfile.setGender(updateProfile.getGender());
            existingProfile.setBirthDate(updateProfile.getBirthDate());
            existingProfile.setPhone(updateProfile.getPhone());
            existingProfile.setAvatar(updateProfile.getAvatar());
            existingProfile.setCity(updateProfile.getCity());
            existingProfile.setDistrict(updateProfile.getDistrict());
            existingProfile.setWard(updateProfile.getWard());
            existingProfile.setStreet(updateProfile.getStreet());
            existingProfile.setInsuranceStatus(updateProfile.getInsuranceStatus());
            existingProfile.setContactName(updateProfile.getContactName());
            existingProfile.setContactRelationship(updateProfile.getContactRelationship());
            existingProfile.setContactPhone(updateProfile.getContactPhone());

            CustomerProfile result = customerProfileRepository.save(existingProfile);
            return mapToDTO(result);
        } else {
            throw new MessageException("Khách hàng không tồn tại ! ");
        }
    }

    public void deleteCustomer(Long id) {
        Optional<CustomerProfile> customer = customerProfileRepository.findById(id);
        if(customer.isPresent()) {
            customerProfileRepository.delete(customer.get());
        } else  {
            throw new MessageException("Khách hàng không tìm thấy !");
        }
    }

    private CustomerProfileDto mapToDTO(CustomerProfile customerProfile) {
        CustomerProfileDto dto = new CustomerProfileDto();
        BeanUtils.copyProperties(customerProfile, dto);
        return dto;
    }

}
