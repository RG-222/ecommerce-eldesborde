package com.eldesborde.ecommerce.service;

import com.eldesborde.ecommerce.model.Producto;
import com.eldesborde.ecommerce.repository.ProductoRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CloudinaryService cloudinaryService;

    public ProductoService(
            ProductoRepository productoRepository,
            CloudinaryService cloudinaryService
    ) {
        this.productoRepository = productoRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // Obtener todos los productos
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // Obtener producto por ID
    public Producto obtenerPorId(Long id) {

        return productoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Producto no encontrado"
                        ));
    }

    // Guardar producto simple
    public Producto guardarProducto(
            Producto producto
    ) {
        return productoRepository.save(
                producto
        );
    }

    // Guardar producto con imagen
    public Producto guardarConImagen(
            String nombre,
            String descripcion,
            Double precio,
            Integer stock,
            MultipartFile imagen
    ) throws IOException {

        String urlImagen =
                cloudinaryService
                        .subirImagen(imagen);

        Producto producto =
                new Producto();

        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setImagenUrl(urlImagen);

        return productoRepository.save(
                producto
        );
    }

    // Editar producto
    public Producto actualizarProducto(
            Long id,
            Producto productoActualizado
    ) {

        Producto productoExistente =
                obtenerPorId(id);

        productoExistente.setNombre(
                productoActualizado.getNombre()
        );

        productoExistente.setDescripcion(
                productoActualizado.getDescripcion()
        );

        productoExistente.setPrecio(
                productoActualizado.getPrecio()
        );

        productoExistente.setStock(
                productoActualizado.getStock()
        );

        return productoRepository.save(
                productoExistente
        );
    }

    // Eliminar producto
    public void eliminar(Long id) {

        Producto producto =
                obtenerPorId(id);

        productoRepository.delete(
                producto
        );
    }
}