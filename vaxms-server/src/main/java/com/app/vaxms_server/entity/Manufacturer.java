package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "manufacturers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Manufacturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "manufacturer_seq")
//    @SequenceGenerator(name = "manufacturer_seq", sequenceName = "manufacturer_sequence", allocationSize = 1)
    @Column(name = "manufacturer_id")
    Long id;

    String name;

    String country;

    Timestamp createdDate;
}
