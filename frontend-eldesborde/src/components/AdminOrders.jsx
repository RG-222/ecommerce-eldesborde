import { useEffect, useState } from "react";

function AdminOrders() {

  const [ordenes, setOrdenes] = useState([]);

  const cargarOrdenes = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "https://ecommerce-eldesborde.onrender.com/api/ordenes",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {

        const error =
          await res.text();

        throw new Error(
          `HTTP ${res.status}: ${error}`
        );
      }

      const data =
        await res.json();

      setOrdenes(data);

    } catch (error) {

      console.error(
        "Error órdenes:",
        error
      );
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Panel de Órdenes</h1>

      {ordenes.map((o) => (
        <div
          key={o.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>Orden #{o.id}</h3>
          <p>👤 Usuario: {o.emailUsuario}</p>
          <p>💰 Total: ${o.total}</p>
          <p>📅 Fecha: {o.fecha}</p>

          <h4>🛒 Productos:</h4>

            {o.items?.map((i) => (
              <div key={i.id}>
                • {i.producto?.nombre} x{i.cantidad} = $
                {(i.precioUnitario * i.cantidad).toLocaleString("es-CL")}
              </div>
            ))}

        </div>
      ))}
    </div>
  );
}

export default AdminOrders;