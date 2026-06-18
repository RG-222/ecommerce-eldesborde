import React from "react";
import { useCarrito } from "../context/CarritoContext";

function Carrito() {

  const {
    carrito,
    eliminarDelCarrito,
    vaciarCarrito
  } = useCarrito();

  const total = carrito.reduce(
    (acc, item) =>
      acc + (item.precio * item.cantidad),
    0
  );

  const finalizarCompra = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    try {

      const items = carrito.map((item) => ({
        productoId: Number(item.id),
        cantidad: Number(item.cantidad)
      }));

      // crear orden
      const ordenRes = await fetch(
        "https://ecommerce-eldesborde.onrender.com/api/ordenes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`
          },
          body: JSON.stringify(items)
        }
      );

      if (!ordenRes.ok) {

        const error =
          await ordenRes.text();

        throw new Error(error);
      }

      const orden =
        await ordenRes.json();

      console.log("ORDEN:", orden);

      // crear pago
      const pagoRes = await fetch(
        `https://ecommerce-eldesborde.onrender.com/api/pagos/crear?ordenId=${orden.id}&monto=${total}`,
        {
          method: "POST"
        }
      );

      const pago =
        await pagoRes.json();

      console.log(
        "RESPUESTA PAGO:",
        pago
      );

      if (
        !pago.url ||
        !pago.token
      ) {
        throw new Error(
          "No llegó respuesta válida de Transbank"
        );
      }

      window.location.href =
        `${pago.url}?token_ws=${pago.token}`;

    } catch (error) {

      console.error(error);

      alert(
        "No se pudo finalizar compra: "
        + error.message
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>🛒 Mi Carrito</h1>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>

          {carrito.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px"
              }}
            >

              <img
                src={item.imagenUrl}
                alt={item.nombre}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.nombre}</h3>

                <p>
                  Cantidad: {item.cantidad}
                </p>

                <p>
                  Precio: $
                  {item.precio.toLocaleString(
                    "es-CL"
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  eliminarDelCarrito(item.id)
                }
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Eliminar
              </button>

            </div>
          ))}

          <hr />

          <h2>
            Total: $
            {total.toLocaleString("es-CL")}
          </h2>

          <button
            onClick={finalizarCompra}
            style={{
              background: "#198754",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            Finalizar compra
          </button>

        </>
      )}

    </div>
  );
}

export default Carrito;