// Componente NavLink compatible que envuelve React Router NavLink
// Permite pasar className normal + activeClassName + pendingClassName al estilo v5
import { cn } from "@/lib/utils"; // Utilidad para combinar clases condicionalmente
import { forwardRef } from "react";
import { NavLinkProps, NavLink as RouterNavLink } from "react-router-dom";

// Props extendidas: igual que NavLinkProps, pero separando las clases por estado
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;        // Clases base
  activeClassName?: string;  // Clases cuando la ruta está activa
  pendingClassName?: string; // Clases mientras está pendiente (carga transición)
}

// Componente NavLink con forwardRef para anclas <a>
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // className en NavLink v6 puede ser función que recibe { isActive, isPending }
        className={({ isActive, isPending }) =>
          cn(
            className,                 // Clases base siempre aplicadas
            isActive && activeClassName,   // Añade activeClassName si isActive === true
            isPending && pendingClassName, // Añade pendingClassName si isPending === true
          )
        }
        {...props} // children, end, reloadDocument, etc.
      />
    );
  },
);

NavLink.displayName = "NavLink"; // Nombre legible en React DevTools

export { NavLink };
