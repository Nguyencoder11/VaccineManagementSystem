package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("select h from Payment h where h.orderId = ?1 and h.requestId = ?2")
    Optional<Payment> findByOrderIdAndRequestId(String orderId, String requestId);

    @Query(value = "select sum(i.amount) from payment i where Month(i.created_date) = ?1 and Year(i.created_date) = ?2", nativeQuery = true)
    public Double calDt(Integer thang, Integer month);

    @Query(value = "select sum(i.amount) from payment i where i.created_date = ?1", nativeQuery = true)
    public Double calToday(Date date);
}
