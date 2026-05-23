import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 cargar sesión al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // login global
  const login = (token) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  // logout global
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = () => user?.rol === "ADMIN";
  const isCliente = () => user?.rol === "CLIENTE";

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin,
      isCliente,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook personalizado
export const useAuth = () => useContext(AuthContext);