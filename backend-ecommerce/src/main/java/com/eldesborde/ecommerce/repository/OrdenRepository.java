package com.eldesborde.ecommerce.repository;

import com.eldesborde.ecommerce.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenRepository
        extends JpaRepository<Orden, Long> {

    List<Orden> findByUsuarioEmail(
            String email
    );
}