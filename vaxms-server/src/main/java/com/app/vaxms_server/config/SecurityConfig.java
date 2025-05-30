package com.app.vaxms_server.config;

import com.app.vaxms_server.jwt.JWTConfigurer;
import com.app.vaxms_server.jwt.JwtAuthenticationFilter;
import com.app.vaxms_server.jwt.JwtTokenProvider;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.utils.Contains;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final CorsFilter corsFilter;

    public SecurityConfig(JwtTokenProvider tokenProvider, UserRepository userRepository, CorsFilter corsFilter) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.corsFilter = corsFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> {})
                .headers(headers -> {})
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("**").permitAll()
                        .requestMatchers("/api/*/public/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // Role-based endpoints
                        .requestMatchers("/api/*/admin/**").hasAuthority(Contains.ROLE_ADMIN)
                        .requestMatchers("/api/*/doctor/**").hasAuthority(Contains.ROLE_DOCTOR)
                        .requestMatchers("/api/*/nurse/**").hasAuthority(Contains.ROLE_NURSE)
                        .requestMatchers("/api/*/customer/**").hasAuthority(Contains.ROLE_CUSTOMER)
                        .requestMatchers("/api/*/staff/**").hasAuthority(Contains.ROLE_STAFF)
                        .requestMatchers("/api/*/all/**").hasAnyAuthority(
                                Contains.ROLE_ADMIN,
                                Contains.ROLE_DOCTOR,
                                Contains.ROLE_NURSE,
                                Contains.ROLE_CUSTOMER,
                                Contains.ROLE_STAFF)

                        // All other requests require authentication
                        .anyRequest().permitAll()
                )
                .addFilterAfter(new JwtAuthenticationFilter(tokenProvider, userRepository), UsernamePasswordAuthenticationFilter.class);
            return http.build();
        }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
