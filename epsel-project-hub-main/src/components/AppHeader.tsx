// Header principal de la aplicación (barra superior)
// Muestra logo, nombre de EPSEL, acciones rápidas y datos del usuario logueado
import { Badge } from "@/components/ui/badge"; // Chip para mostrar rol (admin/usuario)
import { Button } from "@/components/ui/button"; // Botones reutilizables con variantes
import { useAuth } from "@/lib/auth-context"; // Hook de autenticación (usuario actual, logout, isAdmin)
import { LogOut, Plus, User, Users } from "lucide-react"; // Iconos de Lucide
import { useNavigate } from "react-router-dom"; // Navegación programática entre rutas

export default function AppHeader() {
  const { usuario, logout, isAdmin } = useAuth(); // Datos del usuario, función de logout, flag de admin
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  return (
    <header className="hero-gradient text-primary-foreground shadow-lg">
      {/* Contenedor central: limita ancho y alinea contenido */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Bloque izquierdo: logo + nombre + subtítulo, clicable para ir al home */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")} // Click en logo/título → redirige al inicio
        >
          {/* Logo dentro de círculo con blur y fondo translucido */}
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
            {/* Duplicado del mismo contenedor (podría simplificarse, pero se respeta tal cual) */}
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <img
                src="/logo-epsel.jpg" // Ruta del logo de EPSEL
                alt="Logo EPSEL"
                className="w-6 h-6 object-contain" // Ajusta imagen sin deformarla
              />
            </div>
          </div>
          {/* Título y subtítulo del sistema */}
          <div>
            <h1 className="text-lg font-display font-bold leading-tight">
              EPSEL S.A.
            </h1>
            <p className="text-xs opacity-80">Repositorio de Proyectos</p>
          </div>
        </div>
        {/* Bloque derecho: acciones y perfil de usuario */}
        <div className="flex items-center gap-3">
          {/* Botón para crear un nuevo proyecto */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/nuevo")} // Navega a la ruta de nuevo proyecto
            className="font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" /> {/* Icono + texto */}
            Nuevo Proyecto
          </Button>
          {/* Botón solo visible para administradores: gestión de usuarios */}
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/usuarios")} // Navega a gestión de usuarios
              className="font-semibold"
            >
              <Users className="w-4 h-4 mr-1" />
              Gestionar Usuarios
            </Button>
          )}
          {/* Sección de avatar/rol del usuario */}
          <div className="flex items-center gap-2">
            {/* Icono de usuario dentro de un círculo con fondo suave */}
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            {/* Nombre y rol, ocultos en pantallas muy pequeñas */}
            <div className="hidden sm:block text-sm">
              <p className="font-medium leading-tight">{usuario?.nombre}</p>
              <Badge
                variant="outline"
                className="text-[10px] border-primary-foreground/30 text-primary-foreground/80 px-1.5 py-0"
              >
                {/* Muestra “Administrador” o “Usuario” según rol */}
                {usuario?.rol === "admin" ? "Administrador" : "Usuario"}
              </Badge>
            </div>
          </div>
          {/* Botón de logout con icono */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout} // Llama a logout desde el contexto de auth
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}