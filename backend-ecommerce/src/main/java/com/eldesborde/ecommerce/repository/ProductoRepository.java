package com.eldesborde.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.eldesborde.ecommerce.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    
}
