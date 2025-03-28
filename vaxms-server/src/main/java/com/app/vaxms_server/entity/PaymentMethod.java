package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_method_seq")
    @SequenceGenerator(name = "payment_method_seq", sequenceName = "payment_method_sequence", allocationSize = 1)
    @Column(name = "method_id")
    Long id;

    String methodName;
}
