// Punto de entrada de la app React (React 18 con createRoot)
import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // Componente raíz de la aplicación
import "./index.css"; // Estilos globales (Tailwind, resets, etc.)

// Monta la aplicación en el elemento con id="root" del index.html
createRoot(document.getElementById("root")!).render(<App />);