// Página principal del Dashboard: lista proyectos, muestra estadísticas, filtros y exportación a Excel
import AppHeader from "@/components/AppHeader"; // Header con logo, usuario y acciones
import ProjectCard from "@/components/ProjectCard"; // Tarjeta individual de proyecto
import SearchBar from "@/components/SearchBar"; // Input de búsqueda con icono
import StatsCards from "@/components/StatsCards"; // Tarjetas de conteo/filtro por tipo
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select estilizado (shadcn)
import { useToast } from "@/hooks/use-toast"; // Hook para mostrar toasts
import { useAuth } from "@/lib/auth-context"; // Info de usuario (para saber si es admin)
import { exportProjectsExcel, getStoredProjects } from "@/lib/excel-db"; // Persistencia y export a Excel
import { tipoProyectoLabel } from "@/lib/project-utils"; // Texto legible para cada tipo
import { FiltroProyecto, Proyecto } from "@/lib/types"; // Tipos TS para proyectos y filtro
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const { isAdmin } = useAuth(); // Determina si mostrar acciones de admin
  const { toast } = useToast(); // Función para disparar notificaciones
  const [proyectos, setProyectos] = useState<Proyecto[]>([]); // Lista completa de proyectos
  const [search, setSearch] = useState(""); // Texto de búsqueda
  const [areaFilter, setAreaFilter] = useState<string>("todas"); // Filtro por área
  const [filtroTipo, setFiltroTipo] = useState<FiltroProyecto>("todos"); // Filtro por tipo (sgo, sge, etc.)

  // Carga inicial de proyectos desde el "excel-db" al montar el componente
  useEffect(() => {
    setProyectos(getStoredProjects());
  }, []);

  // Lista filtrada según búsqueda, área y tipo de proyecto
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = proyectos;

    // Filtra por tipo si no es "todos"
    if (filtroTipo !== "todos") {
      list = list.filter((p) => p.tipo === filtroTipo);
    }

    // Filtra por área si se eligió una específica
    if (areaFilter !== "todas") {
      list = list.filter((p) => p.area === areaFilter);
    }

    // Si no hay texto de búsqueda, devuelve la lista ya filtrada
    if (!q) return list;

    // Búsqueda por múltiples campos (nombre, supervisor, empresa, área, descripción)
    return list.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.ingenieroSupervisor.toLowerCase().includes(q) ||
        p.empresaEjecutora.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        // También busca dentro de la descripción si existe
        (p.descripcion && p.descripcion.toLowerCase().includes(q)),
    );
  }, [search, areaFilter, filtroTipo, proyectos]);

  // Exporta a Excel solo los proyectos filtrados actualmente
  const handleExportFiltered = () => {
    exportProjectsExcel(filtered);
    toast({
      title: "Excel generado",
      description: `Se descargaron ${filtered.length} proyecto(s) según tu filtro actual.`,
    });
  };

  // Título dinámico de la sección según el filtro de tipo
  const tituloSeccion =
    filtroTipo === "todos"
      ? "Todos los Proyectos"
      : tipoProyectoLabel[filtroTipo];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Tarjetas de estadísticas y filtros rápidos por tipo */}
        <StatsCards
          proyectos={proyectos}
          filtroActivo={filtroTipo}
          onFiltroChange={setFiltroTipo}
        />

        {/* Zona de acciones de admin (exportar Excel) */}
        {isAdmin && (
          <section className="flex">
            <Button variant="outline" onClick={handleExportFiltered}>
              Descargar Excel Proyectos
            </Button>
          </section>
        )}

        {/* Listado de proyectos + filtros por texto y área */}
        <section>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            {tituloSeccion}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Búsqueda de proyectos */}
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar proyectos..."
              />
            </div>
            {/* Filtro por área/gerencia */}
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full sm:w-[220px] bg-card">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las áreas</SelectItem>
                <SelectItem value="Gerencia Comercial">
                  Gerencia Comercial
                </SelectItem>
                <SelectItem value="Gerencia de Proyectos y Obras">
                  Gerencia de Proyectos y Obras
                </SelectItem>
                <SelectItem value="Gerencia Operacional">
                  Gerencia Operacional
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Grid de tarjetas de proyecto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} proyecto={p} index={i} />
            ))}
          </div>
          {/* Mensaje cuando no hay resultados */}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No se encontraron proyectos.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}