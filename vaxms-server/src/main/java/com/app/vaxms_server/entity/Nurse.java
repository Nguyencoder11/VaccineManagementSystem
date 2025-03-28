package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "nurses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Nurse {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "nurse_seq")
    @SequenceGenerator(name = "nurse_seq", sequenceName = "nurse_sequence", allocationSize = 1)
    @Column(name = "nurse_id")
    Long id;

    String qualification;

    Integer experienceYears;

    String bio;

    Timestamp createdDate;

    String fullName;

    String avatar;

    @ManyToOne
    @JoinColumn(name = "account_id")
    User user;
}
