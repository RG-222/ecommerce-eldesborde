import { useEffect, useState } from "react";

function AdminOrders() {

  const [ordenes, setOrdenes] = useState([]);

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

      const data = await res.json();
      setOrdenes(data);

    } catch (error) {
      console.error("Error órdenes:", error);
    }
  };

  const cambiarEstado = async (id, estado) => {

    const token = localStorage.getItem("token");

    try {

      await fetch(
        `https://ecommerce-eldesborde.onrender.com/api/ordenes/${id}/estado`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ estado })
        }
      );

      cargarOrdenes();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const renderOrden = (o) => (
    <div
      key={o.id}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px"
      }}
    >

      <h3>Orden #{o.id}</h3>
      <p>👤 Usuario: {o.emailUsuario}</p>
      <p>💰 Total: ${o.total}</p>
      <p>📅 Fecha: {o.fecha}</p>

      <span style={{
        padding: "4px 8px",
        borderRadius: "6px",
        color: "white",
        background:
          o.estado === "PAGADO" ? "blue" :
          o.estado === "PREPARANDO" ? "orange" :
          o.estado === "ENVIADO" ? "purple" :
          o.estado === "ENTREGADO" ? "green" :
          "gray"
      }}>
        {o.estado}
      </span>

      <h4 style={{ marginTop: "10px" }}>🛒 Productos:</h4>

      {o.items?.map((i) => (
        <div key={i.id}>
          • {i.producto?.nombre} x{i.cantidad} = $
          {(i.precioUnitario * i.cantidad).toLocaleString("es-CL")}
        </div>
      ))}

      {/* BOTONES DE FLUJO */}

      <div style={{ marginTop: "10px" }}>

        {o.estado === "PAGADO" && (
          <button onClick={() => cambiarEstado(o.id, "PREPARANDO")}>
            ➜ Preparar
          </button>
        )}

        {o.estado === "PREPARANDO" && (
          <button onClick={() => cambiarEstado(o.id, "ENVIADO")}>
            ➜ Enviar
          </button>
        )}

        {o.estado === "ENVIADO" && (
          <button onClick={() => cambiarEstado(o.id, "ENTREGADO")}>
            ➜ Entregar
          </button>
        )}

      </div>

    </div>
  );

  return (
    <div style={{ padding: "20px" }}>

      <h1>📊 Panel de Órdenes</h1>

      {/* COLUMNAS */}
      <div style={{ display: "flex", gap: "20px" }}>

        {/* IZQUIERDA */}
        <div style={{ flex: 1 }}>
          <h2>📦 Pedidos Activos</h2>

          {ordenes
            .filter(o =>
              o.estado === "PAGADO" ||
              o.estado === "PREPARANDO"
            )
            .map(renderOrden)}
        </div>

        {/* DERECHA */}
        <div style={{ flex: 1 }}>
          <h2>🚚 Enviados / Entregados</h2>

          {ordenes
            .filter(o =>
              o.estado === "ENVIADO" ||
              o.estado === "ENTREGADO"
            )
            .map(renderOrden)}
        </div>

      </div>

    </div>
  );
}

export default AdminOrders;