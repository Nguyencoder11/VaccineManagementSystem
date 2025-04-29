package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.UserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_seq")
//    @SequenceGenerator(name = "account_seq", sequenceName = "account_sequence", allocationSize = 1)
    @Column(name = "account_id")
    Long id;

    String email;

    String password;

    String googleId;

    String phoneNumber;

    Boolean actived;

    Date createdDate;

    @Column(name = "login_type")
    @Enumerated(EnumType.STRING)
    UserType userType;

    String activationKey;

    String rememberKey;

    @ManyToOne
    @JoinColumn(name = "authority_id")
    Authority authority;
}
