package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "vaccine_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_inventory_seq")
    @SequenceGenerator(name = "vaccine_inventory_seq", sequenceName = "vaccine_inventory_sequence", allocationSize = 1)
    @Column(name = "inventory_id")
    Long id;

    Integer quantity;

    Timestamp importDate;

    Timestamp exportDate;

    Timestamp createDate;

    String status;

    @ManyToOne
    @JoinColumn(name = "vaccine_id")
    Vaccine vaccine;

    @ManyToOne
    @JoinColumn(name = "center_id")
    Center center;
}
