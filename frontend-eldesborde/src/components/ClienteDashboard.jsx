import React, { useEffect, useState } from "react";

function ClienteDashboard() {
  const [ordenes, setOrdenes] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://ecommerce-eldesborde.onrender.com/api/ordenes/mis-ordenes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 👇 SIEMPRE parsear el JSON
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          console.error("Error al cargar órdenes:", data);
          setOrdenes([]);
          return;
        }

        setOrdenes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error de red o servidor:", error);
        setOrdenes([]);
      }
    };

    cargarOrdenes();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>👤 Mi cuenta</h1>

      <h2>Bienvenido {user?.nombre}</h2>

      <h3>Historial de compras</h3>

      {ordenes.length === 0 ? (
        <p>No tienes compras</p>
      ) : (
        ordenes.map((o) => (
          <div
            key={o.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h4>Orden #{o.id}</h4>

            <p>
              Estado: <strong>{o.estado}</strong>
            </p>

            <p>
              Total: <strong>${o.total}</strong>
            </p>

            <h5>Productos</h5>

            {o.items?.map((i) => (
              <div key={i.id}>
                • {i.producto?.nombre} x{i.cantidad}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default ClienteDashboard;