package com.eldesborde.ecommerce.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;

@Component
public class JwtFilter
        extends OncePerRequestFilter {

    private static final String SECRET =
        "eldesborde_super_secret_key_2026_muy_larga";

    private final Key key =
        Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
        );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header =
            request.getHeader("Authorization");

        if (header == null ||
            !header.startsWith("Bearer ")) {

            filterChain.doFilter(
                request,
                response
            );
            return;
        }

        String token =
            header.substring(7);

        try {

            Claims claims =
                Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email =
                claims.getSubject();

            String rol =
                claims.get(
                    "rol",
                    String.class
                );

            // atributos request
            request.setAttribute(
                "email",
                email
            );

            request.setAttribute(
                "rol",
                rol
            );

            // 🔥 autenticación real spring
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(
                        new SimpleGrantedAuthority(
                            "ROLE_" + rol
                        )
                    )
                );

            SecurityContextHolder
                .getContext()
                .setAuthentication(auth);

        } catch (Exception e) {

            response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
            );

            return;
        }

        filterChain.doFilter(
            request,
            response
        );
    }
}