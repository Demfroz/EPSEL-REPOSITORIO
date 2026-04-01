// Componente raíz que decide mostrar Login o Dashboard según el estado de autenticación
import { useAuth } from "@/lib/auth-context"; // Hook que expone usuario, login, logout, isAdmin
import Dashboard from "./Dashboard"; // Página principal después de autenticarse
import Login from "./Login"; // Pantalla de inicio de sesión

export default function Index() {
  const { usuario } = useAuth(); // Obtiene el usuario actual (null si no hay sesión)
  if (!usuario) return <Login />; // Si no hay usuario logueado, muestra la pantalla de Login
  return <Dashboard />;           // Si hay usuario, muestra el Dashboard
}