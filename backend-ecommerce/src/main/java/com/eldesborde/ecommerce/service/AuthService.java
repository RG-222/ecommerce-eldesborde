package com.eldesborde.ecommerce.service;

import com.eldesborde.ecommerce.model.Usuario;
import com.eldesborde.ecommerce.repository.UsuarioRepository;
import com.eldesborde.ecommerce.security.JwtUtil;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;
    

    public AuthService(
            UsuarioRepository usuarioRepo,
            JwtUtil jwtUtil
    ) {
        this.usuarioRepo = usuarioRepo;
        this.jwtUtil = jwtUtil;
    }

    public Usuario obtenerPorEmail(
            String email
    ) {
        return usuarioRepo
            .findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException(
                    "Usuario no encontrado"
                )
            );
    }

    // REGISTRO
    public Usuario registrar(
            Usuario usuario
    ) {

        // evitar que alguien se registre admin
        usuario.setRol(
            "CLIENTE"
        );

        return usuarioRepo.save(
            usuario
        );
    }

    // LOGIN
    public String login(
            String email,
            String password
    ) {

        Usuario usuario =
            usuarioRepo.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException(
                    "Usuario no encontrado"
                )
            );

        if (!usuario.getPassword()
                .equals(password)) {

            throw new RuntimeException(
                "Contraseña incorrecta"
            );
        }

        return jwtUtil.generarToken(
            usuario.getEmail(),
            usuario.getRol()
        );
    }
}