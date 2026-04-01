// Tarjeta de proyecto individual con animación, datos clave y navegación al detalle
import { Badge } from "@/components/ui/badge"; // Chip para mostrar tipo de proyecto
import { Card, CardContent } from "@/components/ui/card"; // Layout de tarjeta
import { tipoProyectoLabel } from "@/lib/project-utils"; // Mapeo tipo → etiqueta legible
import { Proyecto } from "@/lib/types"; // Tipo TypeScript del proyecto
import { motion } from "framer-motion"; // Animaciones declarativas
import {
  Building2,
  CalendarDays,
  Droplets,
  FileText,
  User,
} from "lucide-react"; // Iconos para metadatos
import { useNavigate } from "react-router-dom"; // Navegación programática

interface Props {
  proyecto: Proyecto; // Proyecto a mostrar
  index: number;      // Índice para escalonar animación
}

export default function ProjectCard({ proyecto, index }: Props) {
  const navigate = useNavigate();

  return (
    // Contenedor animado: fade-in + slide-up con pequeño delay según índice
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="cursor-pointer hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/20 group"
        onClick={() => navigate(`/proyecto/${proyecto.id}`)} // Click → navega al detalle del proyecto
      >
        <CardContent className="p-5">
          {/* Encabezado: nombre del proyecto + badge de tipo */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
              {proyecto.nombre}
            </h3>
            <Badge
              variant={proyecto.tipo === "servicio" ? "secondary" : "default"} // Color según tipo
              className="shrink-0 text-xs"
            >
              {tipoProyectoLabel[proyecto.tipo]} {/* Texto amigable del tipo */}
            </Badge>
          </div>
          {/* Descripción corta con máximo 2 líneas */}
          <p className="text-muted-foreground text-xs line-clamp-2 mb-4">
            {proyecto.descripcion}
          </p>
          {/* Grid de metadatos del proyecto */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {/* Fecha del proyecto formateada para es-PE */}
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-primary/60" />
              <span>
                {new Date(proyecto.fecha).toLocaleDateString("es-PE")}
              </span>
            </div>
            {/* Ingeniero supervisor (se limpia el prefijo 'Ing. ') */}
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary/60" />
              <span className="truncate">
                {proyecto.ingenieroSupervisor.replace("Ing. ", "")}
              </span>
            </div>
            {/* Área/gerencia del proyecto */}
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary/60" />
              <span className="truncate">{proyecto.area}</span>
            </div>
            {/* Número de conexiones domiciliares */}
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-primary/60" />
              <span>{proyecto.conexionesDomiciliares} conexiones</span>
            </div>
          </div>
          {/* Info de archivos adjuntos solo si existe al menos uno */}
          {proyecto.archivos.length > 0 && (
            <div className="mt-3 pt-3 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>{proyecto.archivos.length} archivo(s) adjunto(s)</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}