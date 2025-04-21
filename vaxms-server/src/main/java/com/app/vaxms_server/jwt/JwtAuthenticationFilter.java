package com.app.vaxms_server.jwt;

import com.app.vaxms_server.dto.CustomerUserDetails;
//import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.utils.UserUtils;
import com.app.vaxms_server.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        log.info("Authorization Header: {}" , bearerToken);
        // Check if 'header Authorization' contains jwt info, or not?
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                         HttpServletResponse response,
                         FilterChain filterChain) throws IOException, ServletException {

        String path = request.getRequestURI();

        // Bo qua endpoint duoc public
        if (isPublicEndpoint(path)) {
           log.info("Bypassing JWT authentication for public endpoint: {}", path);
           filterChain.doFilter(request, response);
           return;
        }

        try {
            // Get jwt from request
            String jwt = getJwtFromRequest(request);
            log.info("JWT Token: {}", jwt);

            if(jwt != null && tokenProvider.validateToken(jwt)) {
                // Get user id from jwt string
                Long userId = tokenProvider.getUserIdFromJWT(jwt);
                log.info("User ID from JWT: {}", userId);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Get user info from id
                    UserDetails userDetails = new CustomerUserDetails(userRepository.findById(userId).get());
                    log.info("User Details: {}", userDetails);
                    System.out.println("user by access token-----: " + userDetails);

//                    Authentication authentication = tokenProvider.getAuthentication(jwt);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Authentication set for user: {}", userDetails.getUsername());
                }
            } else {
                log.warn("JWT invalid or missing for path: {}", path);
            }
        } catch (Exception ex) {
            log.error("Failed to process JWT authentication for path: {} - Error: {}", path, ex.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs/");
    }

    public Authentication getAuthentication(String token, Long userId) {
        com.app.vaxms_server.entity.User user = userRepository.findById(userId).get();

        String author = user.getAuthority().getName();
        log.info("role: {}", author);
        System.out.println("role: " + author);
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(author.split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(userId.toString(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}
