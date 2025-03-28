package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_seq")
    @SequenceGenerator(name = "comment_seq", sequenceName = "comment_sequence", allocationSize = 1)
    @Column(name = "comment_id")
    Long id;

    String content;

    Integer likesCount;

    Timestamp createdDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "vaccine_id")
    Vaccine vaccine;

    @ManyToOne
    @JoinColumn(name = "news_id")
    News news;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    Comment parentComment;
}
