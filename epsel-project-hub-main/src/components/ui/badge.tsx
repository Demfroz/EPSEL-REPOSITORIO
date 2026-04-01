// Componente Badge (etiqueta/chip) con variantes usando Class Variance Authority (CVA)
// Se usa para mostrar estados, categorías, contadores, etc.
import { cva, type VariantProps } from "class-variance-authority"; // CVA: sistema de variantes tipadas para clases
import * as React from "react";

import { cn } from "@/lib/utils"; // Utilidad para concatenar clases condicionales

// Definición de variantes de estilos del badge
const badgeVariants = cva(
  // Clases base: forma pill, tipografía pequeña, borde, padding, focus visible
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Badge primario
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Badge secundario
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Badge de error/alerta
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Badge solo contorno / neutro
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default", // Variante por defecto si no se especifica
    },
  },
);

// Props del componente Badge: atributos de div + variantes tipadas de CVA
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Componente funcional Badge
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)} // Aplica variante + clases extra
      {...props} // children, onClick, etc.
    />
  );
}

export { Badge, badgeVariants };
