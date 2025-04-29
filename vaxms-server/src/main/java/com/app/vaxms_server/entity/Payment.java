package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.PayType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "payment")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
//    @SequenceGenerator(name = "payment_seq", sequenceName = "payment_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    Integer amount;

    Timestamp createdDate;

    String requestId;

    String orderId;

    @Enumerated(EnumType.STRING)
    PayType payType;

    @ManyToOne
    @JoinColumn(name = "customer_schedule_id")
    CustomerSchedule customerSchedule;

    @ManyToOne
    @JoinColumn(name = "created_by")
    User createdBy;
}
