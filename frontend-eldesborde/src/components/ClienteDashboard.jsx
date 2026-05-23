import React from "react";
import { useAuth } from "../context/AuthContext";

function ClienteDashboard() {

  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <p>No hay sesión activa</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>👤 Mi Cuenta</h1>

      <div style={card}>
        <h2 style={{ color: "black" }}>
          Bienvenido {user.nombre}
        </h2>

        <p style={{ color: "black" }}>
          <b>Email:</b> {user.sub}
        </p>

      </div>

      <h2>🛍 Mis opciones</h2>

      <ul>
        <li>Ver productos</li>
        <li>Mis pedidos</li>
        <li>Carrito</li>
        <li>Historial de compras</li>
      </ul>

    </div>
  );
}

const card = {
  padding: "20px",
  background: "#f5f5f5",
  borderRadius: "10px",
  marginBottom: "20px"
};

export default ClienteDashboard;