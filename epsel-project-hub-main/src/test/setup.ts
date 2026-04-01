// Setup global para tests (Vitest/Jest) en entorno jsdom

// Extiende los matchers de Testing Library, ej: toBeInTheDocument, toHaveTextContent, etc.
import "@testing-library/jest-dom";

// Mock de window.matchMedia para que los componentes que lo usan (ej. useIsMobile)
// no revienten en el entorno de pruebas (jsdom no lo implementa por defecto)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,            // Por defecto, ninguna media query “matchea”
    media: query,
    onchange: null,
    addListener: () => {},     // Métodos legacy sin implementación
    removeListener: () => {},
    addEventListener: () => {}, // Métodos modernos sin implementación
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});