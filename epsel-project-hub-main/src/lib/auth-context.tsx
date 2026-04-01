// Contexto de autenticación simple basado en usuarios almacenados en "excel-db"
// Maneja login/logout, sesión en sessionStorage y flag isAdmin
import { createContext, ReactNode, useContext, useState } from "react";
import { getStoredUsers } from "./excel-db"; // Función que devuelve la lista de usuarios persistidos
import { Usuario } from "./types"; // Tipo TS para usuario (id, nombre, email, rol, password...)

interface AuthContextType {
  usuario: Usuario | null;                         // Usuario actualmente logueado (o null)
  login: (email: string, password: string) => boolean; // Función para intentar login
  logout: () => void;                              // Cierra sesión
  isAdmin: boolean;                                // Flag derivado del rol del usuario
}

// Contexto de autenticación (inicia en null hasta que se provea)
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado de usuario, inicializado leyendo la sesión previa de sessionStorage
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = sessionStorage.getItem("current_session");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string): boolean => {
    // Busca en los usuarios persistidos (ya actualizados/creados)
    const found = getStoredUsers().find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() && // compara email sin importar mayúsculas/espacios
        u.password === password,                                // compara password tal cual
    );

    if (found) {
      // Payload restringido: solo lo necesario para la sesión (no guardas password)
      const userPayload: Usuario = {
        id: found.id,
        nombre: found.nombre,
        email: found.email,
        rol: found.rol,
      };
      setUsuario(userPayload);
      // Persistimos sesión en sessionStorage para que sobreviva al refresh
      sessionStorage.setItem("current_session", JSON.stringify(userPayload));
      return true; // Login exitoso
    }
    return false; // Login fallido
  };

  const logout = () => {
    setUsuario(null); // Limpia usuario en memoria
    sessionStorage.removeItem("current_session"); // Borra sesión persistida
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAdmin: usuario?.rol === "admin", // Calcula flag admin a partir del rol
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia para consumir el contexto de auth
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider"); // Garantiza que se use bajo AuthProvider
  return ctx;
}