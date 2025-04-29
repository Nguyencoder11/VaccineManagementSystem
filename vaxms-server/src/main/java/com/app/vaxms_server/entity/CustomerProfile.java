package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "customer_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_profile_seq")
//    @SequenceGenerator(name = "customer_profile_seq", sequenceName = "customer_profile_sequence", allocationSize = 1)
    @Column(name = "profile_id")
    Long id;

    String fullName;

    @Enumerated(EnumType.STRING)
    Gender gender;

    Date birthDate;

    String phone;

    String avatar;

    String city;

    String district;

    String ward;

    String street;

    Boolean insuranceStatus;

    String contactName;

    String contactRelationship;

    String contactPhone;

    Timestamp createdDate;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    User user;
}
