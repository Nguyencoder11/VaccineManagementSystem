package com.app.vaxms_server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.app.vaxms_server.config.SqlTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleTimeDto {
    private Long scheduleId;
    private Date date;

    @JsonFormat(pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeSerializer.class)
    private Time startTime;

    @JsonFormat(pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeSerializer.class)
    private Time endTime;

    Integer numHour;

    Integer maxPeople;

    public ScheduleTimeDto(Time startTime, Time endTime, Integer numHour, Integer maxPeople) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.numHour = numHour;
        this.maxPeople = maxPeople;
    }
}
