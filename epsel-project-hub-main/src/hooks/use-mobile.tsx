// Hook para detectar si la ventana actual está en modo "móvil" (según breakpoint)
import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Ancho en px a partir del cual se considera desktop (>= 768)

export function useIsMobile() {
  // isMobile inicia como undefined para evitar mismatch SSR/CSR
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // MediaQueryList para escuchar cambios en el tamaño de la ventana
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      // Actualiza el estado según el ancho actual de la ventana
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Suscripción al evento change de la media query
    mql.addEventListener("change", onChange);
    // Set inicial al montar el hook
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Limpia el listener al desmontar
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Siempre devuelve booleano (false cuando todavía era undefined)
  return !!isMobile;
}