package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Entity
@Table(name = "vaccine_schedule_doctor")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineScheduleDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_schedule_doctor_seq")
//    @SequenceGenerator(name = "vaccine_schedule_doctor_seq", sequenceName = "vaccine_schedule_doctor_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    Date injectDate;

    @ManyToOne
    Doctor doctor;

    @ManyToOne
    VaccineSchedule vaccineSchedule;
}
