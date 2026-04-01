// Componente Alert (notificación/mensaje) con variantes usando Class Variance Authority (CVA)
// Sistema de alertas semántico con icono posicionado, responsive y tipado TypeScript
import { cva, type VariantProps } from "class-variance-authority"; // CVA: genera clases CSS variantes tipadas
import * as React from "react";

import { cn } from "@/lib/utils"; // Utilidad para combinar clases Tailwind

// Define variantes de estilos base usando CVA (Class Variance Authority)
const alertVariants = cva(
  // Clases base COMUNES a todas las variantes
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Componente Alert principal - forwardRef con tipos de CVA
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>  // Props HTML + variantes tipadas
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

// Título del Alert - h5 semántico con tipografía destacada
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

// Descripción del Alert - contenedor flexible para párrafos
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Exporta componentes para uso compuesto
export { Alert, AlertDescription, AlertTitle };

