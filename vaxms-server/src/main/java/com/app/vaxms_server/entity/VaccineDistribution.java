package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.DistributionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "vaccine_distribution")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineDistribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_distribution_seq")
//    @SequenceGenerator(name = "vaccine_distribution_seq", sequenceName = "vaccine_distribution_sequence", allocationSize = 1)
    @Column(name = "distribution_id")
    Long id;

    Integer quantity;

    Timestamp distributionDate;

    @Column(name = "distribution_type")
    @Enumerated(EnumType.STRING)
    DistributionType distributionType;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    VaccineInventory vaccineInventory;
}
