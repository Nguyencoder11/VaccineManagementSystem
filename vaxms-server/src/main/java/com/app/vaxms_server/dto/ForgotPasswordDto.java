package com.app.vaxms_server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordDto {
    private String url;

    private String email;
}
