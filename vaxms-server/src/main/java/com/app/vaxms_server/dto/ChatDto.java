package com.app.vaxms_server.dto;

import com.app.vaxms_server.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatDto {
    User user;
    String lastContent;
    String time;
    Timestamp timestamp;
    String styleContent;
}
