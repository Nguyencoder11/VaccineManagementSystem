package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "age_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AgeGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "age_group_seq")
    @SequenceGenerator(name = "age_group_seq", sequenceName = "age_group_sequence", allocationSize = 1)
    @Column(name = "age_group_id")
    Long id;

    String ageRange;

    Timestamp createdDate;
}
