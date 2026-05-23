package com.eldesborde.ecommerce.config;

import com.eldesborde.ecommerce.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtFilter jwtFilter
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // 🔥 CORS REAL
            .cors(cors -> cors.configurationSource(request -> {

                CorsConfiguration config =
                    new CorsConfiguration();

                config.setAllowedOriginPatterns(
                    List.of(
                        "http://localhost:*"
                    )
                );

                config.setAllowedMethods(
                    List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                    )
                );

                config.setAllowedHeaders(
                    List.of("*")
                );

                config.setAllowCredentials(true);

                return config;
            }))

            .authorizeHttpRequests(auth -> auth

                // preflight cors
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // públicas
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                .requestMatchers(
                    "/api/productos/**"
                ).permitAll()

                // admin
                .requestMatchers(
                    "/api/ordenes"
                ).hasRole("ADMIN")

                // cliente autenticado
                .requestMatchers(
                    "/api/ordenes/crear"
                ).authenticated()

                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}