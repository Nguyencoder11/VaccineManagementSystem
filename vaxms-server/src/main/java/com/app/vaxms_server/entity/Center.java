package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "centers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "center_seq")
//    @SequenceGenerator(name = "center_seq", sequenceName = "center_sequence", allocationSize = 1)
    @Column(name = "center_id")
    Long id;

    String centerName;

    String city;

    String district;

    String ward;

    String street;

    Timestamp createdDate;
}
