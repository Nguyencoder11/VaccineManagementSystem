package com.app.vaxms_server.config;

import com.cloudinary.Cloudinary;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@SpringBootApplication
public class CloudConfig {
    @Bean
    public Cloudinary cloudinaryConfigs() {
        Cloudinary cloudinary = null;
        Map config = new HashMap();
        config.put("cloud_name", "dhe0ysmoy");
        config.put("api_key", "875921558241419");
        config.put("api_secret", "drsU20BRAs03UlD0JWRc5dHwKcg");
        cloudinary = new Cloudinary(config);
        return cloudinary;
    }
}
