package com.eldesborde.ecommerce.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    private Double total;

    private String estado;
    // PENDIENTE, PAGADO, CANCELADO

    private LocalDateTime fecha;

    @OneToMany(mappedBy = "orden",
            cascade = CascadeType.ALL)
    private List<DetalleOrden> items;
}