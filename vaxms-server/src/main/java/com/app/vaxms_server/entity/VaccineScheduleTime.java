package com.app.vaxms_server.entity;

import com.app.vaxms_server.config.SqlTimeSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "vaccine_schedule_time")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineScheduleTime {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_schedule_time_seq")
    @SequenceGenerator(name = "vaccine_schedule_time_seq", sequenceName = "vaccine_schedule_time_sequence", allocationSize = 1)
    Long id;

    Date injectDate;

    @JsonFormat(pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeSerializer.class)
    Time start;

    @JsonFormat(pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeSerializer.class)
    Time end;

    Integer limitPeople;

    @ManyToOne
    VaccineSchedule vaccineSchedule;
}
