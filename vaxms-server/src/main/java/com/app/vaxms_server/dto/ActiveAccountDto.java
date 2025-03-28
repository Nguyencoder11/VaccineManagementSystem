package com.app.vaxms_server.dto;

public class ActiveAccountDto {
    private String email;
    private String key;

    public ActiveAccountDto() {}

    public ActiveAccountDto(String email, String key) {
        this.email = email;
        this.key = key;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
