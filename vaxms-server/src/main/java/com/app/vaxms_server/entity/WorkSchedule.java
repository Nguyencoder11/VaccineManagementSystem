package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "work_schedules")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "work_schedule_seq")
//    @SequenceGenerator(name = "work_schedule_seq", sequenceName = "work_schedule_sequence", allocationSize = 1)
    Long id;

    @Column(name = "doctor_id", nullable = false)
    Long doctorId;

    @Column(name = "working_date", nullable = false)
    LocalDate workingDate;

    @Column(name = "working_time", nullable = false)
    LocalTime workingTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getWorkingDate() {
        return workingDate;
    }

    public void setWorkingDate(LocalDate workingDate) {
        this.workingDate = workingDate;
    }

    public LocalTime getWorkingTime() {
        return workingTime;
    }

    public void setWorkingTime(LocalTime workingTime) {
        this.workingTime = workingTime;
    }

}
