import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { carrito } = useCarrito();

  const {
    user,
    logout,
    isAdmin,
    isCliente
  } = useAuth();

  const cantidadTotal = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("NAVBAR ACTUALIZADA");

  return (
    <nav style={styles.nav}>

      {/* LOGO */}
      <Link to="/" style={styles.logo}>
        🛍 El Desborde
      </Link>

      {/* LINKS */}
      <div style={styles.links}>

        <Link style={styles.link} to="/">
          Tienda
        </Link>

        {isCliente() && (
          <Link
            style={styles.link}
            to="/mi-cuenta"
          >
            Mi cuenta
          </Link>
        )}

        {isAdmin() && (
          <>
            <Link
              style={styles.link}
              to="/admin"
            >
              Admin
            </Link>

            <Link
              style={styles.link}
              to="/admin/ordenes"
            >
              Órdenes
            </Link>
          </>
        )}

      </div>

      {/* DERECHA */}
      <div style={styles.right}>

        <Link
          style={styles.cart}
          to="/carrito"
        >
          🛒 {cantidadTotal}
        </Link>

        {user ? (
          <>
            <span style={styles.user}>
              👤 {user.nombre || user.sub}
            </span>

            <button
              onClick={handleLogout}
              style={styles.btn}
            >
              Salir
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={styles.login}
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    background: "#FFC8DD",
    color: "white",
    borderBottom: "1px solid #222"
  },

  logo: {
    color: "black",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "20px",
    letterSpacing: "0.5px"
  },

  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center"
  },

  link: {
    color: "#000000",
    textDecoration: "none",
    fontSize: "14px"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  cart: {
    background: "#A2D2FF",
    padding: "6px 10px",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontSize: "14px"
  },

  user: {
    fontSize: "14px",
    color: "#000000"
  },

  btn: {
    background: "#e63946",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  login: {
    background: "#000000",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    textDecoration: "none"
  }
};

export default Navbar;