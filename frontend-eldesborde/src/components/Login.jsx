import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://ecommerce-eldesborde.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      alert("Error al iniciar sesión");
      return;
    }

    const data = await res.json();

      // guardar token
      login(data.token);

      // guardar usuario completo
      localStorage.setItem(
        "user",
        JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          rol: data.rol
        })
      );

      if (data.rol === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
  };

  return (
    <div style={container}>

      <form onSubmit={handleLogin} style={card}>

        <h2>🔐 Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button style={button}>
          Entrar
        </button>

        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/register">
            Regístrate
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;

/* 🔥 ESTILO ORIGINAL LIMPIO (como el tuyo base) */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "hsl(0, 0%, 0%)"
};

const card = {
  padding: "30px",
  background: "gray",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "300px"
};

const input = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const button = {
  padding: "10px",
  background: "#222",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};