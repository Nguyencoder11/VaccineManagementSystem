package com.app.vaxms_server.dto;

import com.app.vaxms_server.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDto {
    private String token;

    private User user;
}
