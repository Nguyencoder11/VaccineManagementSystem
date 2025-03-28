package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.CustomerSchedulePay;
import com.app.vaxms_server.enums.PayStatus;
import com.app.vaxms_server.enums.StatusCustomerSchedule;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "customer_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_schedule_seq")
    @SequenceGenerator(name = "customer_schedule_seq", sequenceName = "customer_schedule_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "GMT+7")
    Timestamp createdDate;

    String fullName;

    Date dob;

    String phone;

    String address;

    String note;

    String healthStatusBefore;
    String healthStatusAfter;

    Integer counterChange;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_status")
    PayStatus payStatus;

    @Enumerated(EnumType.STRING)
    CustomerSchedulePay customerSchedulePay;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    StatusCustomerSchedule statusCustomerSchedule;

    @ManyToOne
    @JoinColumn(name = "account_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "vaccine_schedule_time_id")
    VaccineScheduleTime vaccinceScheduleTime;
}
