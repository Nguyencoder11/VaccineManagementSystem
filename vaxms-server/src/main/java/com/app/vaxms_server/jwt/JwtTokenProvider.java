package com.app.vaxms_server.jwt;

import com.app.vaxms_server.dto.CustomerUserDetails;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION_TIME;

    private static final String AUTHORITIES_KEY = "roles";
    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    // Create jwt from user info
    public String generateToken(CustomerUserDetails userDetails){
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + JWT_EXPIRATION_TIME);
//        String authorities = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(","));
        String authority = userDetails.getAuthorities().iterator().next().getAuthority();   // Single role
        // Create json web token string from id of user
        return Jwts.builder()
                .setSubject(Long.toString(userDetails.getUser().getId()))
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .claim(AUTHORITIES_KEY, authority)
                .compact();
    }

    // Get user info from jwt
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        Date date = claims.getExpiration();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            if(authToken == null || authToken.isBlank()) {
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(JWT_SECRET)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }

        return false;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(JWT_SECRET)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }

//        String author = claims.get(AUTHORITIES_KEY).toString()
//                .substring(1, claims.get(AUTHORITIES_KEY).toString().length() - 1);
//        System.out.println("role: " + author);
//        Collection<? extends GrantedAuthority> authorities =
//                Arrays.stream(author.split(","))
//                .filter(auth -> !auth.trim().isEmpty())
//                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());

//        String authoritiesStr = claims.get(AUTHORITIES_KEY).toString();
//        Collection<? extends GrantedAuthority> authorities = authoritiesStr.isEmpty()
//                ? Collections.emptyList()
//                : Arrays.stream(authoritiesStr.split(","))
//                .filter(auth -> !auth.trim().isEmpty())
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());

        String authority = claims.get(AUTHORITIES_KEY, String.class);
        Collection<? extends GrantedAuthority> authorities = authority != null
                ? Collections.singletonList(new SimpleGrantedAuthority(authority))
                : Collections.emptyList();

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean isTokenValid(String authToken) {
        if (authToken == null || authToken.trim().isEmpty()) {
            return false;
        }
        return validateToken(authToken);
    }
}
