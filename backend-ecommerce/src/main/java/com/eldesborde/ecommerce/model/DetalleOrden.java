package com.eldesborde.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Orden orden;

    @ManyToOne
    private Producto producto;

    private Integer cantidad;

    private Double precioUnitario;

    // 🔥 temporal para recibir desde frontend
    @Transient
    private Long productoId;
}