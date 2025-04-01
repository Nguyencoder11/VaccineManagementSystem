package com.app.vaxms_server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = {"com.app.vaxms_server.repository"})
@EnableTransactionManagement
public class DatabaseConfiguration {
}
