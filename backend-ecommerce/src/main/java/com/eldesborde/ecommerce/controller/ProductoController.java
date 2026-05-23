package com.eldesborde.ecommerce.controller;

import com.eldesborde.ecommerce.model.Producto;
import com.eldesborde.ecommerce.service.ProductoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(
            ProductoService productoService
    ) {
        this.productoService = productoService;
    }

    // Obtener todos los productos
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }

    // Obtener producto por ID
    @GetMapping("/detalle/{id}")
    public ResponseEntity<?> obtenerPorId(
            @PathVariable("id") Long id
    ) {

        try {

            Producto producto =
                    productoService
                            .obtenerPorId(id);

            return ResponseEntity.ok(
                    producto
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(404)
                    .body(e.getMessage());
        }
    }

    // Crear producto con imagen
    @PostMapping("/con-foto")
    public ResponseEntity<?> guardarConFoto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") Double precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("imagen") MultipartFile imagen
    ) {

        try {

            Producto producto =
                    productoService
                            .guardarConImagen(
                                    nombre,
                                    descripcion,
                                    precio,
                                    stock,
                                    imagen
                            );

            return ResponseEntity.ok(
                    producto
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(500)
                    .body(
                            "Error al guardar producto: "
                                    + e.getMessage()
                    );
        }
    }

    // Crear producto simple
    @PostMapping
    public Producto guardar(
            @RequestBody Producto producto
    ) {
        return productoService
                .guardarProducto(producto);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable("id") Long id,
            @RequestBody Producto producto
    ) {

        try {

            Producto actualizado =
                    productoService
                            .actualizarProducto(
                                    id,
                                    producto
                            );

            return ResponseEntity.ok(
                    actualizado
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(404)
                    .body(e.getMessage());
        }
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            productoService.eliminar(id);

            return ResponseEntity.ok(
                    "Producto eliminado correctamente"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(500)
                    .body(
                            "Error al eliminar: "
                                    + e.getMessage()
                    );
        }
    }
}