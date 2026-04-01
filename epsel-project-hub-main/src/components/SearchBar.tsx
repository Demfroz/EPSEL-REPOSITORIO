// Barra de búsqueda reutilizable para filtrar proyectos u otros listados
import { Input } from "@/components/ui/input"; // Input estilizado (shadcn/ui)
import { Search } from "lucide-react"; // Icono de lupa para indicar búsqueda

interface Props {
  value: string;                  // Valor actual del input (controlado desde el padre)
  onChange: (val: string) => void; // Callback cuando cambia el texto
  placeholder?: string;           // Texto placeholder opcional
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar proyectos...", // Placeholder por defecto
}: Props) {
  return (
    <div className="relative">
      {/* Icono de búsqueda posicionado dentro del input (a la izquierda, centrado vertical) */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)} // Propaga el nuevo texto al padre
        placeholder={placeholder}
        className="pl-10 bg-card" // Padding-left extra para no solaparse con el icono + fondo estilo "card"
      />
    </div>
  );
}