package com.eldesborde.ecommerce.service;

import com.eldesborde.ecommerce.model.Usuario;
import com.eldesborde.ecommerce.repository.UsuarioRepository;
import com.eldesborde.ecommerce.security.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UsuarioRepository usuarioRepo, JwtUtil jwtUtil) {
        this.usuarioRepo = usuarioRepo;
        this.jwtUtil = jwtUtil;
    }

    public Usuario obtenerPorEmail(String email) {
        return usuarioRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario registrar(Usuario usuario) {
        usuario.setRol("CLIENTE");

        String passwordCifrada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordCifrada);

        return usuarioRepo.save(usuario);
    }

    public String login(String email, String password) {
        Usuario usuario = usuarioRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return jwtUtil.generarToken(usuario.getEmail(), usuario.getRol());
    }
}