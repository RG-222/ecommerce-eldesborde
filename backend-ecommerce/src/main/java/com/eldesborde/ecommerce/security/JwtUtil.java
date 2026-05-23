package com.eldesborde.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
        "eldesborde_super_secret_key_2026_muy_larga";

    private final Key key =
        Keys.hmacShaKeyFor(
            SECRET.getBytes(
                StandardCharsets.UTF_8
            )
        );

    public String generarToken(String email, String rol) {

        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(
                    new Date(System.currentTimeMillis() + 86400000)
                )
                .signWith(key)
                .compact();
    }

    public String extraerEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}