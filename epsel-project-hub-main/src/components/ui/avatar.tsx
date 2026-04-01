// Componente Avatar personalizado basado en Radix UI primitives
// Muestra imagen de perfil con fallback automático (iniciales) si falla la carga
import { cn } from "@/lib/utils"; // Utilidad para combinar clases Tailwind
import * as AvatarPrimitive from "@radix-ui/react-avatar"; // Primitivos headless accesibles
import * as React from "react";

// Contenedor raíz del avatar - círculo fijo 40x40px
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      // Estilos base: posición relativa, círculo perfecto, overflow hidden
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// Imagen principal del avatar - ocupa 100% del contenedor
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)} // Cuadrado perfecto, full size
    {...props} // src="..." alt="..." etc.
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// Fallback automático (iniciales) cuando la imagen falla/no carga
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      // Centrado perfecto, fondo gris muted, círculo completo
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props} // Children: "JD", "CN", etc.
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Exporta componentes para uso compuesto
export { Avatar, AvatarFallback, AvatarImage };
