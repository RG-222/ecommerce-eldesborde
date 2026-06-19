import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

function PagoExitoso() {

  const navigate = useNavigate();
  const { vaciarCarrito } = useCarrito();

  useEffect(() => {

    let ejecutado = false;

    const confirmar = async () => {

      if (ejecutado) return;
      ejecutado = true;

      try {

        const token = new URLSearchParams(window.location.search)
          .get("token_ws");

        if (!token) {
          alert("Token no encontrado");
          navigate("/");
          return;
        }

        const res = await fetch(
          "https://ecommerce-eldesborde.onrender.com/api/pagos/confirmar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token_ws: token })
          }
        );

        const data = await res.json();

        if (data.status === "AUTHORIZED") {
          vaciarCarrito();
          alert("Pago exitoso 🎉");
        } else {
          alert("Pago rechazado");
        }

        navigate("/mi-cuenta");

      } catch (e) {
        console.error(e);
        alert("Error en pago");
        navigate("/");
      }
    };

    confirmar();

  }, []);

  return <h1>Procesando pago...</h1>;
}

export default PagoExitoso;