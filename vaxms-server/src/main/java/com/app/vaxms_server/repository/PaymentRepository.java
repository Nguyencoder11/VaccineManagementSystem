package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("select h from Payment h where h.orderId = ?1 and h.requestId = ?2")
    Optional<Payment> findByOrderIdAndRequestId(String orderId, String requestId);
}
