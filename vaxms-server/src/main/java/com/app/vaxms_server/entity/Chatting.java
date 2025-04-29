package com.app.vaxms_server.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "chatting")
@Getter
@Setter
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Chatting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq")
//    @SequenceGenerator(name = "chat_seq", sequenceName = "chatting_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    String content;

    Timestamp createdDate;

    Boolean isFile = false;

    String fileName;

//    String typeFile;

    @ManyToOne
    @JoinColumn(name = "sender")
    User sender;

    @ManyToOne
    @JoinColumn(name = "receiver")
    User receiver;

}
