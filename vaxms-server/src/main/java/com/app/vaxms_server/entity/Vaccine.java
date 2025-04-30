package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "vaccine")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_seq")
//    @SequenceGenerator(name = "vaccine_seq", sequenceName = "vaccine_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    String name;

    @Column(length = 1000)
    String description;

    String image;

    Integer price;

    Integer quantity;

    Timestamp createdDate;

    Integer inventory;

    String status;

    Timestamp expirationDate;

    @ManyToOne
    @JoinColumn(name = "type_id")
    VaccineType vaccineType;


    @ManyToOne
    @JoinColumn(name = "manufacturer_id")
    Manufacturer manufacturer;

    @ManyToOne
    @JoinColumn(name = "age_group_id")
    AgeGroup ageGroup;
}
