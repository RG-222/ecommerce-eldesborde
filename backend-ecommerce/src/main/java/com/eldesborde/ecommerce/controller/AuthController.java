package com.eldesborde.ecommerce.controller;

import com.eldesborde.ecommerce.model.Usuario;
import com.eldesborde.ecommerce.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario u) {
        return service.registrar(u);
    }

    

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Usuario u
    ) {

        String token = service.login(
            u.getEmail(),
            u.getPassword()
        );

        Usuario usuario =
            service.obtenerPorEmail(
                u.getEmail()
            );

        return Map.of(
            "token", token,
            "rol", usuario.getRol(),
            "nombre", usuario.getNombre(),
            "email", usuario.getEmail()
        );
    }
}