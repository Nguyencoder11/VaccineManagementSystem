package com.app.vaxms_server.constant;

import com.google.gson.annotations.SerializedName;

public enum Language {
    @SerializedName("vi")
    VI(Constants.LANGUAGE_VN),

    @SerializedName("en")
    EN(Constants.LANGUAGE_EN);

    private final String value;

    Language(String value) {
        this.value = value;
    }

    public String getLanguage() {
        return value;
    }

    public static Language findByName(String name) {
        for (Language language : values()) {
            if(language.getLanguage().equals(name)) {
                return language;
            }
        }
        return null;
    }
}
