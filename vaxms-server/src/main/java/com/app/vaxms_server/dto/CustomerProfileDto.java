package com.app.vaxms_server.dto;

import com.app.vaxms_server.enums.Gender;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerProfileDto {
    Long id;
    String fullname;
    Gender gender;
    Date birthDate;
    String phone;
    String avatar;
    String city;
    String district;
    String ward;
    String street;
    Boolean insuranceStatus;
    String contactName;
    String contactRelationship;
    String contactPhone;
    Timestamp createdDate;
}
