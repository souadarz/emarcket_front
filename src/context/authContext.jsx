import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //verifie si un token existe déjà dans le localStorage au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/api/v2/users/profile")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // login
  const login = async (email, password) => {
    const res = await api.post("/api/v2/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
     console.log("toooken ", localStorage.getItem("token"));
    setUser(res.data.user);
  };

  //register
  const register = async (fullname, email, password) => {
    const res = await api.post("/api/v2/auth/register", { fullname, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  //logout
  const logout = async () => {
    try {
      await api.post("/api/v2/auth/logout");
    } catch (e) {
      console.log("Erreur logout:", e);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};