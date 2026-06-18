import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(
        "https://ecommerce-eldesborde.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            rol: "CLIENTE"
          })
        }
      );

      if (!res.ok) {
        throw new Error(
          "No se pudo registrar"
        );
      }

      alert(
        "Cuenta creada correctamente 🎉"
      );

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(
        "Error al registrarse"
      );
    }
  };

  return (
    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.card}
      >
        <h1 style={{ color: "black" }}> Crear cuenta </h1>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
        >
          Registrarme
        </button>

        <p>
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            style={{
                color: "black",
                fontWeight: "600",
                textDecoration: "none"
            }}
            >
            Inicia sesión
            </Link>
        </p>

      </form>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "60px"
  },

  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 0 10px rgba(0,0,0,0.15)",
    background: "white"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#ff7eb6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Register;