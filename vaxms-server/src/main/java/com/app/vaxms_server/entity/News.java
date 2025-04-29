package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "news")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "news_seq")
//    @SequenceGenerator(name = "news_seq", sequenceName = "news_sequence", allocationSize = 1)
    @Column(name = "news_id")
    Long id;

    String title;

    String content;

    String image;

    Timestamp createdDate;

    @ManyToOne
    @JoinColumn(name = "author_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    Topic topic;


}
