package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "payment_details")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_detail_seq")
    @SequenceGenerator(name = "payment_detail_seq", sequenceName = "payment_detail_sequence", allocationSize = 1)
    @Column(name = "payment_detail_id")
    Long id;

    Integer amount;

    Timestamp transactionDate;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    Payment payment;

    @ManyToOne
    @JoinColumn(name = "method_id")
    PaymentMethod paymentMethod;
}
