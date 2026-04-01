import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getStoredProjects, saveProjects } from "@/lib/excel-db";
import {
  ArchivoProyecto,
  AreaGerencia,
  Proyecto,
  TipoProyecto,
} from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, FileUp, Paperclip, Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProject() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estado para los archivos adjuntos (en memoria antes de guardar)
  const [selectedFiles, setSelectedFiles] = useState<ArchivoProyecto[]>([]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "" as TipoProyecto,
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
    ingenieroSupervisor: "",
    registradoPor: "",
    area: "" as AreaGerencia,
    empresaEjecutora: "",
    conexionesDomiciliares: 0,
    metrosLinealesAgua: 0,
    metrosLinealesAlcantarillado: 0,
    costoProyecto: 0,
  });

  // Función para procesar archivos y convertirlos a Base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: ArchivoProyecto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      const promise = new Promise<void>((resolve) => {
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          const extension = file.name.split(".").pop()?.toLowerCase() || "";

          // Mapeo simple de extensiones según tu interface
          let tipoFinal: "pdf" | "rar" | "jpg" = "pdf";
          if (extension === "rar" || extension === "zip") tipoFinal = "rar";
          if (["jpg", "jpeg", "png"].includes(extension)) tipoFinal = "jpg";

          newFiles.push({
            id: crypto.randomUUID(),
            nombre: file.name,
            tipo: tipoFinal,
            url: base64String, // Aquí viaja el archivo real
          });
          resolve();
        };
      });

      reader.readAsDataURL(file);
      await promise;
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    // Limpiamos el input para poder subir el mismo archivo si se desea
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo || !formData.area) {
      toast({
        title: "Error",
        description: "Por favor, seleccione el tipo de proyecto y el área.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentProjects = getStoredProjects();

      const nuevoProyecto: Proyecto = {
        ...formData,
        id: crypto.randomUUID(),
        archivos: selectedFiles, // Guardamos los archivos convertidos
      };

      saveProjects([...currentProjects, nuevoProyecto]);

      toast({
        title: "Proyecto registrado",
        description: "El proyecto y sus archivos se han guardado localmente.",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error de almacenamiento",
        description:
          "Los archivos podrían ser muy pesados para la memoria local.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">
            Registrar Nuevo Proyecto
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Proyecto */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-display">
                  Información del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre del Proyecto *</Label>
                  <Input
                    placeholder="Ej: Ampliación Red de Agua Potable"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo *</Label>
                    <Select
                      required
                      onValueChange={(value: TipoProyecto) =>
                        setFormData({ ...formData, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sgo">S.G.O.</SelectItem>
                        <SelectItem value="sge">S.G.E.</SelectItem>
                        <SelectItem value="servicio">Servicio</SelectItem>
                        <SelectItem value="elaboracion_tdr">
                          Elaboración TDR
                        </SelectItem>
                        <SelectItem value="sgmr_ap">SGMR AP</SelectItem>
                        <SelectItem value="sgmr_alc">
                          SGMR Alcantarillado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha *</Label>
                    <Input
                      type="date"
                      required
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    placeholder="Describa el proyecto..."
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Responsables */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-display">
                  Responsables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ingeniero Supervisor *</Label>
                    <Input
                      required
                      value={formData.ingenieroSupervisor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ingenieroSupervisor: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Registrado por *</Label>
                    <Input
                      required
                      value={formData.registradoPor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registradoPor: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Área / Gerencia *</Label>
                    <Select
                      required
                      onValueChange={(value: AreaGerencia) =>
                        setFormData({ ...formData, area: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área" />
                      </SelectTrigger>
                      <SelectContent>
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
                  <div className="space-y-2">
                    <Label>Empresa Ejecutora *</Label>
                    <Input
                      required
                      value={formData.empresaEjecutora}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          empresaEjecutora: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Archivos Local */}
            <Card className="shadow-card border-dashed border-2">
              <CardHeader>
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-primary" />
                  Archivos Adjuntos (PDF, RAR, JPG)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Haga clic para subir archivos
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.rar,.zip,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-md bg-background border shadow-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Paperclip className="w-4 h-4 shrink-0 text-primary" />
                          <span className="text-sm truncate font-medium">
                            {file.nombre}
                          </span>
                          <span className="text-[10px] bg-muted px-1.5 rounded uppercase">
                            {file.tipo}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datos Técnicos */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-display">
                  Datos Técnicos y Costo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Costo del Proyecto (S/.)</Label>
                    <Input
                      type="number"
                      value={formData.costoProyecto}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          costoProyecto: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Conexiones Domiciliares</Label>
                    <Input
                      type="number"
                      value={formData.conexionesDomiciliares}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          conexionesDomiciliares: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Metros Lineales Agua Potable</Label>
                    <Input
                      type="number"
                      value={formData.metrosLinealesAgua}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrosLinealesAgua: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Metros Lineales Alcantarillado</Label>
                    <Input
                      type="number"
                      value={formData.metrosLinealesAlcantarillado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrosLinealesAlcantarillado: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pb-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button type="submit" className="px-8">
                <Save className="w-4 h-4 mr-2" />
                Guardar Proyecto
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
