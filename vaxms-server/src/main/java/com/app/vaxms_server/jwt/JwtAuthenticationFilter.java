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
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Slf4j
public class JwtAuthenticationFilter extends GenericFilterBean {
    private final JwtTokenProvider tokenProvider;

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // Check if 'header Authorization' contains jwt info, or not?
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        try {
            // Get jwt from request
            String jwt = getJwtFromRequest((HttpServletRequest) request);
            if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                // Get user id from jwt string
                Long userId = tokenProvider.getUserIdFromJWT(jwt);
                // Get user info from id
                UserDetails userDetails = new CustomerUserDetails(userRepository.findById(userId).get());
                System.out.println("user by access token-----: " + userDetails);
                if(userDetails != null) {
                    // If user is valid, set infor for Security Context
                    Authentication authentications = getAuthentication(jwt, userId);
                    SecurityContextHolder.getContext().setAuthentication(authentications);
                }
            }
        } catch (Exception ex) {
            log.error("failed on set user authentication", ex);
        }
        filterChain.doFilter(request, response);
    }

    public Authentication getAuthentication(String token, Long userId) {
        com.app.vaxms_server.entity.User user = userRepository.findById(userId).get();

        String author = user.getAuthority().getName();
        System.out.println("role: " + author);
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(author.split(","))
                .filter(auth -> auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(userId.toString(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}
