package com.app.vaxms_server.jwt;

import com.app.vaxms_server.dto.CustomerUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;


import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION;

    private static final String AUTHORITIES_KEY = "roles";

//    SecretKey key;
//
//    @PostConstruct
//    public void init() {
//        this.key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
//    }

    // Create jwt from user info
    public String generateToken(CustomerUserDetails userDetails){
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + JWT_EXPIRATION);

//        String authorities = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(","));

        // Create json web token string from id of user
        return Jwts.builder()
                .setSubject(Long.toString(userDetails.getUser().getId()))
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .claim(AUTHORITIES_KEY, userDetails.getAuthorities().toString())
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    // Get user info from jwt
    public Long getUserIdFromJWT(String token) {
//        Claims claims = parseClaims(token);
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();
//        Date date = claims.getExpiration();
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
//            if(authToken == null || authToken.isBlank()) {
//                return false;
//            }
            parseClaims(authToken);

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
//            claims = parseClaims(token);
            claims = Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }

//        String roles = claims.get(AUTHORITIES_KEY, String.class);
//        System.out.println("role: " + roles);

//        Collection<? extends GrantedAuthority> authorities = (roles == null || roles.isEmpty())
//            ? Collections.emptyList()
//            : Arrays.stream(roles.split(","))
//                .map(String::trim)
//                .filter(auth -> !auth.isEmpty())
//                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());

        String author = claims.get(AUTHORITIES_KEY).toString().substring(1, claims.get(AUTHORITIES_KEY).toString().length()-1);
        System.out.println("role: "+author);
        Collection<? extends GrantedAuthority>authorities = Arrays
                .stream(author.split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
