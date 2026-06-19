package com.eldesborde.ecommerce.controller;

import com.eldesborde.ecommerce.model.*;
import com.eldesborde.ecommerce.service.OrdenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ecommerce-eldesborde-1.onrender.com"
})
public class OrdenController {

    private final OrdenService service;

    public OrdenController(OrdenService service) {
        this.service = service;
    }

    @GetMapping
    public List<Orden> listar() {
        return service.obtenerOrdenes();
    }

    @GetMapping("/mis-ordenes")
    public List<Orden> misOrdenes(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return service.obtenerMisOrdenes(email);
    }

    @PostMapping
    public Orden crear(@RequestBody List<DetalleOrden> items,
                       HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        if (email == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        return service.crearOrden(items, email);
    }

    @PutMapping("/{id}/estado")
    public Orden actualizarEstado(
            @PathVariable Long id,
            @RequestBody EstadoRequest request
    ) {
        return service.actualizarEstado(id, request.getEstado());
    }
}