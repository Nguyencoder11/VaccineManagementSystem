package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    private String email;
    private String password;
    private String tokenDevice;
}
