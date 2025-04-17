package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "vaccine_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_schedule_seq")
    @SequenceGenerator(name = "vaccine_schedule_seq", sequenceName = "vaccine_schedule_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    Date startDate;

    Date endDate;

    Integer limitPeople;

    Timestamp createdDate;

    Long idPreSchedule;

    BigDecimal price;

    String description;

    @ManyToOne
    @JoinColumn(name = "vaccine_id")
    Vaccine vaccine;

    @ManyToOne
    @JoinColumn(name = "center_id")
    Center center;

    @ManyToOne
    @JoinColumn(name = "created_by")
    User user;

    @Transient
    Boolean inStock = false;

    @OneToMany(mappedBy = "vaccineSchedule", cascade = CascadeType.REMOVE)
    List<VaccineScheduleTime> vaccineScheduleTimes;
}
