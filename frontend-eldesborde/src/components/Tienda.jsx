import React, { useState, useEffect } from 'react';

import { useCarrito } from '../context/CarritoContext';

const Tienda = () => {
  const { agregarAlCarrito } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {

    fetch(
      'http://localhost:8080/api/productos'
    )
      .then(response => response.json())
      .then(data => {

        setProductos(data);
        setCargando(false);

      })
      .catch(error => {

        console.error(
          "Error al obtener productos:",
          error
        );

        setCargando(false);
      });

  }, []);

  if (cargando)
    return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: '15px' }}>

      <h1>
        Productos El Desborde 🛍️
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >

        {productos.map(producto => (

          <div
            key={producto.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center',
              boxShadow:
                '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >

            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />

            <h3>
              {producto.nombre}
            </h3>

            <p>
              {producto.descripcion}
            </p>

            <h2>
              $
              {producto.precio.toLocaleString(
                'es-CL'
              )}
            </h2>

            <p>
              Stock:
              {' '}
              {producto.stock}
            </p>

            <button onClick={() => agregarAlCarrito( producto )}
              disabled={ producto.stock === 0}
              style={{ background: producto.stock === 0 ? '#999' : '#222',
                color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%'}}>
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Tienda;