// Componente Card y subcomponentes: layout de tarjeta reutilizable (header, contenido, footer)
import * as React from "react";

import { cn } from "@/lib/utils"; // Utilidad para combinar clases Tailwind condicionalmente

// Card: contenedor principal de la tarjeta
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Tarjeta con borde, fondo, texto y sombra suave
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className, // Permite sobrescribir/extender estilos desde fuera
    )}
    {...props} // children, onClick, etc.
  />
));
Card.displayName = "Card"; // Nombre para React DevTools

// CardHeader: área superior de la tarjeta (título + descripción)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Layout en columna, separación vertical y padding general
      "flex flex-col space-y-1.5 p-6",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// CardTitle: título principal de la tarjeta
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Texto grande, seminegrita, sin espacio extra entre líneas, kerning ajustado
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// CardDescription: texto secundario debajo del título
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      // Texto pequeño y color “muted” (menos énfasis)
      "text-sm text-muted-foreground",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// CardContent: cuerpo de la tarjeta (contenido principal)
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Padding general, sin padding-top (porque ya lo suele aportar el header)
      "p-6 pt-0",
      className,
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// CardFooter: parte inferior de la tarjeta (acciones, botones, etc.)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Layout en fila, alinea verticalmente los elementos, padding sin padding-top
      "flex items-center p-6 pt-0",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Exporta todos los subcomponentes para uso compuesto
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};
