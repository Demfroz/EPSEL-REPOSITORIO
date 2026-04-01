// Componente AspectRatio - wrapper minimalista de Radix UI
// Mantiene proporción fija de elementos (imágenes, videos, embeds) independientemente del contenedor
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"; // Primitive headless para ratios fijos

// Alias directo del primitive de Radix - sin estilos adicionales
// El ratio se controla vía CSS custom properties (--aspect-ratio: 16/9;)
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
