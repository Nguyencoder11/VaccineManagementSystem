package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Entity
@Table(name = "vaccine_schedule_nurse")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineScheduleNurse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_schedule_nurse_seq")
//    @SequenceGenerator(name = "vaccine_schedule_nurse_seq", sequenceName = "vaccine_schedule_nurse_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    Date injectDate;

    @ManyToOne
    Nurse nurse;

    @ManyToOne
    VaccineSchedule vaccineSchedule;
}
