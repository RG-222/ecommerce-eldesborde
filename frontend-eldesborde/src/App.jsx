import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useCarrito } from "./context/CarritoContext";
import { useAuth } from "./context/AuthContext";

import Tienda from "./components/Tienda";
import AdminPanel from "./components/AdminPanel";
import Carrito from "./components/Carrito";
import AdminOrders from "./components/AdminOrders";
import Login from "./components/Login";
import ClienteDashboard from "./components/ClienteDashboard";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import PagoExitoso from "./components/PagoExitoso";

function App() {

  const { carrito } = useCarrito();
  const { user, logout, isAdmin } = useAuth();

  const cantidadTotal = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  const AdminRoute = ({ children }) => {
    return isAdmin() ? children : <Navigate to="/" />;
  };

  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />

        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        <Route path="/admin/ordenes" element={<AdminRoute><AdminOrders /></AdminRoute>} />

        <Route path="/mi-cuenta" element={<ClienteDashboard />} />

        <Route path="/register" element={<Register />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
      </Routes>

    </Router>
  );
}

export default App;