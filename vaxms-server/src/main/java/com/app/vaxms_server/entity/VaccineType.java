package com.app.vaxms_server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vaccine_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VaccineType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vaccine_type_seq")
    @SequenceGenerator(name = "vaccine_type_seq", sequenceName = "vaccine_type_sequence", allocationSize = 1)
    @Column(name = "type_id")
    Long id;

    String typeName;

    Timestamp createdDate;

    String description;

    @ManyToOne
    @JsonIgnoreProperties(value = {"vaccineTypes"})
    VaccineType vaccineType;

    Boolean isPrimary;

    @OneToMany(mappedBy = "vaccineType", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"vaccineTypes"})
    List<VaccineType> vaccineTypes = new ArrayList<>();

}
