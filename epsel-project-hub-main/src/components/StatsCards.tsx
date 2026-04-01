// Tarjetas de estadísticas de proyectos + filtros rápidos por tipo
import { Card, CardContent } from "@/components/ui/card"; // Layout de tarjeta
import { tipoProyectoLabel } from "@/lib/project-utils"; // Mapeo de tipos → etiquetas legibles
import { FiltroProyecto, Proyecto } from "@/lib/types"; // Tipos TS para proyectos y filtro
import { motion } from "framer-motion"; // Animaciones de entrada
import {
  Building2,
  ClipboardList,
  FileText,
  FolderOpen,
  GlassWaterIcon,
  WavesIcon,
  Wrench,
} from "lucide-react"; // Iconos para cada tipo de estadística

interface Props {
  proyectos: Proyecto[];                 // Lista completa de proyectos
  filtroActivo: FiltroProyecto;          // Filtro actualmente seleccionado
  onFiltroChange: (filtro: FiltroProyecto) => void; // Callback al cambiar filtro
}

export default function StatsCards({
  proyectos,
  filtroActivo,
  onFiltroChange,
}: Props) {
  // Cálculos de conteos por tipo de proyecto
  const totalSgo = proyectos.filter((p) => p.tipo === "sgo").length;
  const totalSge = proyectos.filter((p) => p.tipo === "sge").length;
  const totalServicios = proyectos.filter((p) => p.tipo === "servicio").length;
  const totalTdr = proyectos.filter((p) => p.tipo === "elaboracion_tdr").length;

  // Definición estática de tarjetas de stats (label, valor, icono y filtro asociado)
  const stats: {
    label: string;
    value: number;
    icon: typeof FolderOpen; // Tipo del componente icono (todos son Lucide)
    filtro: FiltroProyecto;
  }[] = [
    {
      label: "Todos los Proyectos",
      value: proyectos.length,
      icon: FolderOpen,
      filtro: "todos",
    },
    {
      label: `Total ${tipoProyectoLabel.sgo}`,
      value: totalSgo,
      icon: Building2,
      filtro: "sgo",
    },
    {
      label: `Total ${tipoProyectoLabel.sge}`,
      value: totalSge,
      icon: FileText,
      filtro: "sge",
    },
    {
      label: "Total de Servicios",
      value: totalServicios,
      icon: Wrench,
      filtro: "servicio",
    },
    {
      label: `Total ${tipoProyectoLabel.elaboracion_tdr}`,
      value: totalTdr,
      icon: ClipboardList,
      filtro: "elaboracion_tdr",
    },
    {
      label: "Total SGMR AP",
      value: proyectos.filter((p) => p.tipo === "sgmr_ap").length,
      icon: GlassWaterIcon,
      filtro: "sgmr_ap",
    },
    {
      label: "Total SGMR ALC",
      value: proyectos.filter((p) => p.tipo === "sgmr_alc").length,
      icon: WavesIcon,
      filtro: "sgmr_alc",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}                 // Animación de entrada (fade + slide)
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }} // Escalonado por índice
        >
          <Card
            className={`border shadow-card cursor-pointer transition-all ${
              filtroActivo === stat.filtro
                ? "ring-2 ring-primary border-primary"    // Estado activo: resaltado con ring
                : "hover:border-primary/50"               // Hover solo cuando no está activo
            }`}
            onClick={() => onFiltroChange(stat.filtro)}   // Click → cambia filtro
          >
            <CardContent className="p-4 flex items-center gap-3">
              {/* Icono dentro de un recuadro; cambia de color según activo/inactivo */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  filtroActivo === stat.filtro
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              {/* Valor numérico grande + etiqueta descriptiva */}
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}