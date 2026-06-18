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

    @Transient
    private Long productoId;

    // 🔥 IMPORTANTE: evita problemas de deserialización
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }
}