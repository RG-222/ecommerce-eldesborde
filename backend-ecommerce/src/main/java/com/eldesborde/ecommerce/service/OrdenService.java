package com.eldesborde.ecommerce.service;

import com.eldesborde.ecommerce.model.*;
import com.eldesborde.ecommerce.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdenService {

    private final OrdenRepository ordenRepo;
    private final ProductoRepository productoRepo;
    private final UsuarioRepository usuarioRepo;

    public OrdenService(
            OrdenRepository ordenRepo,
            ProductoRepository productoRepo,
            UsuarioRepository usuarioRepo
    ) {
        this.ordenRepo = ordenRepo;
        this.productoRepo = productoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public List<Orden> obtenerOrdenes() {
        return ordenRepo.findAll();
    }

    public List<Orden> obtenerMisOrdenes(String email) {
        return ordenRepo.findByUsuarioEmail(email);
    }

    public Orden crearOrden(
            List<DetalleOrden> items,
            String emailUsuario
    ) {

        Usuario usuario =
                usuarioRepo.findByEmail(emailUsuario)
                        .orElseThrow(() ->
                                new RuntimeException("Usuario no encontrado"));

        Orden orden = new Orden();
        orden.setUsuario(usuario);
        orden.setFecha(LocalDateTime.now());
        orden.setEstado("PENDIENTE");

        double total = 0;

        List<DetalleOrden> detalles = new ArrayList<>();

        for (DetalleOrden item : items) {

            if (item.getProductoId() == null) {
                throw new RuntimeException("productoId viene null desde frontend");
            }

            Producto producto =
                    productoRepo.findById(item.getProductoId())
                            .orElseThrow(() ->
                                    new RuntimeException("Producto no encontrado"));

            // validar stock
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Sin stock para: " + producto.getNombre());
            }

            // descontar stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepo.save(producto);

            // crear detalle real
            DetalleOrden detalle = new DetalleOrden();
            detalle.setOrden(orden);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            detalles.add(detalle);

            total += producto.getPrecio() * item.getCantidad();
        }

        orden.setItems(detalles);
        orden.setTotal(total);

        return ordenRepo.save(orden);
    }
}