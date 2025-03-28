package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {

    public CustomerProfile findByUser(Long userId);

    public Page<CustomerProfile> getCustomerProfile(@Param("") String q, Pageable pageable);
}
