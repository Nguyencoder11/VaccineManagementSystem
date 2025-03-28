package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "news_sources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewSource {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "news_sources_seq")
    @SequenceGenerator(name = "news_sources_seq", sequenceName = "news_sources_sequence", allocationSize = 1)
    @Column(name = "source_id")
    Long id;

    String sourceName;

    String sourceUrl;

    @ManyToOne
    @JoinColumn(name = "news_id")
    News news;
}
