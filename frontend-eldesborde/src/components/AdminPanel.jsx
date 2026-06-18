import React, { useState, useEffect } from 'react';

function AdminPanel() {

  // =======================
  // 📦 PRODUCTOS
  // =======================
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', descripcion: '', precio: '', stock: ''
  });
  const [archivo, setArchivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);

  // =======================
  // 📊 ÓRDENES (DASHBOARD)
  // =======================
  const [ordenes, setOrdenes] = useState([]);

  // =======================
  // LOAD DATA
  // =======================
  const cargarProductos = () => {
    fetch('https://ecommerce-eldesborde.onrender.com/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  };

  const cargarOrdenes = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://ecommerce-eldesborde.onrender.com/api/ordenes",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error(
          `Error ${res.status}`
        );
      }

      const data = await res.json();

      setOrdenes(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (e) {

      console.error(
        "Error órdenes:",
        e
      );

      setOrdenes([]);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarOrdenes();
  }, []);

  // =======================
  // 💰 MÉTRICAS DASHBOARD
  // =======================
  const ingresosTotales =
    Array.isArray(ordenes)
      ? ordenes.reduce(
          (acc, o) => acc + o.total,
          0
        )
      : 0;

  const totalOrdenes = ordenes.length;

  const productosVendidos = {};

  ordenes.forEach(o => {
    o.items.forEach(i => {
      if (!productosVendidos[i.nombre]) {
        productosVendidos[i.nombre] = 0;
      }
      productosVendidos[i.nombre] += i.cantidad;
    });
  });

  let productoTop = "";
  let max = 0;

  Object.entries(productosVendidos).forEach(([nombre, cantidad]) => {
    if (cantidad > max) {
      max = cantidad;
      productoTop = nombre;
    }
  });

  // =======================
  // CRUD PRODUCTOS (TU CÓDIGO)
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (modoEdicion) {
        const res = await fetch(
          `https://ecommerce-eldesborde.onrender.com/api/productos/${productoEditandoId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
          }
        );

        if (res.ok) {
          alert("Producto actualizado");
          cargarProductos();
          setModoEdicion(false);
          setProductoEditandoId(null);
          setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '' });
          return;
        }
      }

      const formData = new FormData();
      formData.append('nombre', nuevoProducto.nombre);
      formData.append('descripcion', nuevoProducto.descripcion);
      formData.append('precio', nuevoProducto.precio);
      formData.append('stock', nuevoProducto.stock);
      formData.append('imagen', archivo);

      const res = await fetch(
        'https://ecommerce-eldesborde.onrender.com/api/productos/con-foto',
        { method: 'POST', body: formData }
      );

      if (res.ok) {
        alert("Producto creado");
        cargarProductos();
      }

    } catch (e) {
      console.error(e);
    }
  };

  const editarProducto = (p) => {
    setNuevoProducto({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock
    });
    setModoEdicion(true);
    setProductoEditandoId(p.id);
  };

  const eliminarProducto = async (id) => {
    await fetch(`https://ecommerce-eldesborde.onrender.com/api/productos/${id}`, {
      method: 'DELETE'
    });
    cargarProductos();
  };

  // =======================
  // UI
  // =======================
  return (
    <div style={{ padding: '20px' }}>

      <h2>📊 Metricas</h2>

      {/* =======================
          KPI CARDS
      ======================= */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>

        <div style={card}>
          <h3>💰 Ingresos</h3>
          <p>${ingresosTotales}</p>
        </div>

        <div style={card}>
          <h3>🧾 Órdenes</h3>
          <p>{totalOrdenes}</p>
        </div>

        <div style={card}>
          <h3>🔥 Top Producto</h3>
          <p>{productoTop || "N/A"}</p>
        </div>

      </div>

      {/* =======================
          FORM PRODUCTOS
      ======================= */}
      <h2>🛠 Productos</h2>

      <form onSubmit={handleSubmit} style={form}>
        <input placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        />

        <textarea placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        />

        <input type="number" placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={e => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
        />

        <input type="number" placeholder="Stock"
          value={nuevoProducto.stock}
          onChange={e => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
        />

        <input type="file"
          onChange={e => setArchivo(e.target.files[0])}
          required={!modoEdicion}
        />

        <button type="submit">
          {modoEdicion ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* =======================
          LISTA PRODUCTOS
      ======================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {productos.map(p => (
          <div key={p.id} style={cardBox}>

            <img src={p.imagenUrl} style={{ width: '100%', height: 120 }} />

            <div style={{ width: "100%", textAlign: "left" }}>
              <h4>{p.nombre}</h4>
              <p>${p.precio}</p>
              <p>Stock: {p.stock}</p>
              <p>Descripción: {p.descripcion}</p>
            </div>

            <button onClick={() => editarProducto(p)}>✏️ Editar</button>
            <button onClick={() => eliminarProducto(p.id)}>🗑 Eliminar</button>

          </div>
        ))}
      </div>

    </div>
  );
}

// estilos
const card = {
  flex: 1,
  padding: 20,
  background: '#f5f5f5',
  borderRadius: 10
};

const form = {
  display: 'grid',
  gap: 10,
  marginBottom: 30
};

const cardBox = {
  border: '1px solid #ddd',
  padding: 10,
  borderRadius: 10
};

export default AdminPanel;