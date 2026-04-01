// Pantalla de Login: formulario de acceso con validación simple y animación
import { Button } from "@/components/ui/button"; // Botón estilizado
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Contenedor de tarjeta
import { Input } from "@/components/ui/input"; // Inputs de texto
import { Label } from "@/components/ui/label"; // Labels accesibles
import { useAuth } from "@/lib/auth-context"; // Hook para ejecutar login
import { motion } from "framer-motion"; // Animación de entrada
import { LogIn } from "lucide-react"; // Icono de login
import { useState } from "react";

export default function Login() {
  const { login } = useAuth(); // Función login(email, password) que devuelve boolean
  const [email, setEmail] = useState(""); // Estado controlado del correo
  const [password, setPassword] = useState(""); // Estado controlado de la contraseña
  const [error, setError] = useState(""); // Mensaje de error en caso de credenciales inválidas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga de la página
    setError("");
    // Intenta loguear; si devuelve false, muestra error
    if (!login(email, password)) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      {/* Contenedor animado: aparece con fade-in + movimiento vertical */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0">
          {/* Header con logo, nombre y subtítulo */}
          <CardHeader className="text-center pb-2 pt-8">
            {/* Circulo decorativo con gradiente y sombra que envuelve el logo */}
            <div className="mx-auto w-24 h-24 rounded-full hero-gradient flex items-center justify-center mb-4 shadow-lg">
              {/* Contenedor duplicado (mismo estilo anidado) respetado tal cual */}
              <div className="mx-auto w-24 h-24 rounded-full hero-gradient flex items-center justify-center mb-4 shadow-lg">
                <img
                  src="/logo-epsel.jpg"
                  alt="Logo EPSEL"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              EPSEL S.A.
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Repositorio de Proyectos
            </p>
          </CardHeader>
          {/* Contenido del formulario de login */}
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo de correo */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@epsel.gob.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Campo de contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Mensaje de error si las credenciales no son válidas */}
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              {/* Botón de envío con icono de login */}
              <Button type="submit" className="w-full" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}