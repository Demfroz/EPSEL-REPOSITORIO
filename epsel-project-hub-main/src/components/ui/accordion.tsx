// Componente Accordion personalizado basado en Radix UI primitives
// Wrapper estilizado siguiendo patrón shadcn/ui para máxima reutilización
import { cn } from "@/lib/utils"; // Utilidad para combinar clases Tailwind condicionalmente
import * as AccordionPrimitive from "@radix-ui/react-accordion"; // Primitivos headless accesibles
import { ChevronDown } from "lucide-react"; // Icono de flecha para estado abierto/cerrado
import * as React from "react";

// Componente raíz del acordeón - alias directo del primitive de Radix
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>, // Tipo del elemento ref
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> // Props sin ref
>(({ className, ...props }, ref) => ( // Desestructuración con spread para props restantes
  <AccordionPrimitive.Item
    ref={ref} // Forward ref al primitive nativo
    className={cn("border-b", className)} // Borde inferior por defecto + clases personalizadas
    {...props} // Props restantes pasan directo al primitive
  />
));
AccordionItem.displayName = "AccordionItem"; // Nombre para DevTools de React

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  // Header completo del ítem acordeón (Trigger + icono)
  <AccordionPrimitive.Header className="flex"> {/* Flex para alinear trigger + icono */}
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Estilos base del botón trigger
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        // Selector CSS arbitrario de Tailwind: rota SVG hijo solo cuando data-state=open
        "[&[data-state=open]>svg]:rotate-180",
        className // Clases personalizadas sobrescriben
      )}
      {...props}
    >
      {children} {/* Contenido del trigger (texto, iconos, etc.) */}
      {/* Icono que rota 180° al abrir - shrink-0 evita que se comprima */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName; // Hereda displayName de Radix

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Clases para animaciones basadas en data attributes de Radix
    className="overflow-hidden text-sm transition-all 
                data-[state=closed]:animate-accordion-up 
                data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* Wrapper interno con padding específico para contenido */}
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName; // Hereda de Radix

// Exporta todos los subcomponentes para uso compuesto
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
