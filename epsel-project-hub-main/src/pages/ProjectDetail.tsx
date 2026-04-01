import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { getStoredProjects, saveProjects } from "@/lib/excel-db";
import { tipoProyectoLabel } from "@/lib/project-utils";
import { Proyecto, TipoProyecto } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  Building2,
  CalendarDays,
  Download,
  Droplets,
  FileText,
  Image,
  Pencil,
  Ruler,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Proyecto | null>(null);

  // Obtener proyecto inicial
  const proyectoOriginal = useMemo(() => {
    const todos = getStoredProjects();
    return todos.find((p) => p.id === id);
  }, [id]);

  useEffect(() => {
    if (proyectoOriginal) setEditData(proyectoOriginal);
  }, [proyectoOriginal]);

  if (!proyectoOriginal || !editData) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Proyecto no encontrado.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    const todos = getStoredProjects();
    const nuevosProyectos = todos.map((p) => (p.id === id ? editData : p));
    saveProjects(nuevosProyectos);
    setIsEditing(false);
    toast({
      title: "Proyecto actualizado",
      description: "Los cambios se guardaron localmente.",
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.",
      )
    ) {
      const todos = getStoredProjects();
      const filtrados = todos.filter((p) => p.id !== id);
      saveProjects(filtrados);
      toast({ title: "Proyecto eliminado", variant: "destructive" });
      navigate("/");
    }
  };

  const descargarArchivo = (url: string, nombre: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileIcon = (tipo: string) => {
    if (tipo === "pdf")
      return <FileText className="w-5 h-5 text-destructive" />;
    if (tipo === "jpg") return <Image className="w-5 h-5 text-blue-500" />;
    if (tipo === "rar") return <Archive className="w-5 h-5 text-amber-600" />;
    return <Archive className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>

          {isAdmin && (
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSaveEdit}
                  >
                    <Save className="w-4 h-4 mr-2" /> Guardar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancelar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            {isEditing ? (
              <Input
                className="text-2xl font-bold h-auto"
                value={editData.nombre}
                onChange={(e) =>
                  setEditData({ ...editData, nombre: e.target.value })
                }
              />
            ) : (
              <h1 className="text-2xl font-display font-bold text-foreground">
                {editData.nombre}
              </h1>
            )}

            {isEditing ? (
              <Select
                value={editData.tipo}
                onValueChange={(v: TipoProyecto) =>
                  setEditData({ ...editData, tipo: v })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sgo">S.G.O.</SelectItem>
                  <SelectItem value="sge">S.G.E.</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className="text-sm shrink-0">
                {tipoProyectoLabel[editData.tipo] || editData.tipo}
              </Badge>
            )}
          </div>

          <Card className="mb-6 shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.descripcion}
                  onChange={(e) =>
                    setEditData({ ...editData, descripcion: e.target.value })
                  }
                />
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {editData.descripcion || "Sin descripción."}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableRow
                  isEditing={isEditing}
                  icon={<CalendarDays className="w-4 h-4 text-primary" />}
                  label="Fecha"
                  type="date"
                  value={editData.fecha}
                  onChange={(v) => setEditData({ ...editData, fecha: v })}
                />

                <EditableRow
                  isEditing={isEditing}
                  icon={<User className="w-4 h-4 text-primary" />}
                  label="Ingeniero Supervisor"
                  value={editData.ingenieroSupervisor}
                  onChange={(v) =>
                    setEditData({ ...editData, ingenieroSupervisor: v })
                  }
                />

                <EditableRow
                  isEditing={isEditing}
                  icon={<Building2 className="w-4 h-4 text-primary" />}
                  label="Empresa Ejecutora"
                  value={editData.empresaEjecutora}
                  onChange={(v) =>
                    setEditData({ ...editData, empresaEjecutora: v })
                  }
                />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Datos Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableRow
                  isEditing={isEditing}
                  icon={<Droplets className="w-4 h-4 text-accent" />}
                  label="Conexiones"
                  type="number"
                  value={String(editData.conexionesDomiciliares)}
                  onChange={(v) =>
                    setEditData({
                      ...editData,
                      conexionesDomiciliares: Number(v),
                    })
                  }
                />

                <EditableRow
                  isEditing={isEditing}
                  icon={<Ruler className="w-4 h-4 text-accent" />}
                  label="Metros Agua (m)"
                  type="number"
                  value={String(editData.metrosLinealesAgua)}
                  onChange={(v) =>
                    setEditData({ ...editData, metrosLinealesAgua: Number(v) })
                  }
                />

                <EditableRow
                  isEditing={isEditing}
                  icon={<Building2 className="w-4 h-4 text-accent" />}
                  label="Costo (S/.)"
                  type="number"
                  value={String(editData.costoProyecto)}
                  onChange={(v) =>
                    setEditData({ ...editData, costoProyecto: Number(v) })
                  }
                />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Archivos Adjuntos</CardTitle>
              <Badge variant="outline">
                {editData.archivos?.length || 0} archivos
              </Badge>
            </CardHeader>
            <CardContent>
              {editData.archivos?.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground text-sm">
                  No hay archivos.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {editData.archivos?.map((archivo) => (
                    <div
                      key={archivo.id}
                      onClick={() =>
                        descargarArchivo(archivo.url, archivo.nombre)
                      }
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary/5 cursor-pointer transition-colors"
                    >
                      {fileIcon(archivo.tipo)}
                      <span className="text-sm font-medium flex-1 truncate">
                        {archivo.nombre}
                      </span>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

// Componente auxiliar para filas editables
function EditableRow({
  isEditing,
  icon,
  label,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 p-1.5 rounded-md bg-secondary/50 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-[10px] uppercase font-bold">
          {label}
        </p>
        {isEditing ? (
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 mt-1"
          />
        ) : (
          <p className="text-foreground font-medium truncate">
            {type === "date"
              ? new Date(value).toLocaleDateString("es-PE")
              : value}
          </p>
        )}
      </div>
    </div>
  );
}
