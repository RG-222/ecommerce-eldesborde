import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

export const getRol = () => getUser()?.rol;

export const isAdmin = () => getRol() === "ADMIN";

export const isCliente = () => getRol() === "CLIENTE";

export const logout = () => {
  localStorage.removeItem("token");
};