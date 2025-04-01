package com.app.vaxms_server.jwt;

import com.app.vaxms_server.dto.CustomerUserDetails;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {
    private final String JWT_SECRET = "abcdefgh";
    private static final String AUTHORITIES_KEY = "roles";
    private final long JWT_EXPIRATION_TIME = 604800000L;

    // Create jwt from user info
    public String generateToken(CustomerUserDetails userDetails){
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + JWT_EXPIRATION_TIME);
        // Create json web token string from id of user
        return Jwts.builder()
                .setSubject(Long.toString(userDetails.getUser().getId()))
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .claim("roles", userDetails.getAuthorities().toString())
                .compact();
    }

    // Get user info from jwt
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        Date date = claims.getExpiration();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).build().parseClaimsJws(authToken);
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
            claims = Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        String author = claims.get(AUTHORITIES_KEY).toString().substring(1, claims.get(AUTHORITIES_KEY).toString().length() - 1);
        System.out.println("role: " + author);
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(author.split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}
