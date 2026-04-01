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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { getStoredUsers, saveUsers } from "@/lib/excel-db";
import { UsuarioExcel } from "@/lib/types";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UsersManagement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UsuarioExcel[]>([]);

  // Formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"admin" | "usuario">("usuario");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carga inicial forzada desde LocalStorage
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    const stored = getStoredUsers();
    setUsers(stored);
  }, [isAdmin, navigate]);

  const startEdit = (user: UsuarioExcel) => {
    setEditingId(user.id);
    setNombre(user.nombre);
    setEmail(user.email);
    setPassword(user.password);
    setRol(user.rol);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("usuario");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Obtenemos lo más reciente del disco para evitar sobreescrituras accidentales
    const currentUsers = getStoredUsers();
    let updatedUsers: UsuarioExcel[];

    if (editingId) {
      // MODO EDICIÓN: Mapeamos y reemplazamos
      updatedUsers = currentUsers.map((u) =>
        u.id === editingId
          ? { ...u, nombre, email: email.toLowerCase(), password, rol }
          : u,
      );
    } else {
      // MODO CREACIÓN
      if (
        currentUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
      ) {
        toast({
          title: "Error",
          description: "El correo ya existe",
          variant: "destructive",
        });
        return;
      }
      const newUser: UsuarioExcel = {
        id: crypto.randomUUID(),
        nombre,
        email,
        password,
        rol,
      };
      updatedUsers = [...currentUsers, newUser];
    }

    // 2. PERSISTENCIA CRÍTICA: Guardar en LocalStorage
    saveUsers(updatedUsers);

    // 3. Sincronizar estado de React con lo que acabamos de guardar
    setUsers(updatedUsers);

    cancelEdit();
    toast({
      title: editingId ? "Usuario actualizado" : "Usuario creado",
      description: "Los datos se han guardado permanentemente en el navegador.",
    });
  };

  const removeUser = (id: string) => {
    const current = getStoredUsers();
    const next = current.filter((u) => u.id !== id);

    saveUsers(next); // Guardar cambio
    setUsers(next); // Actualizar vista

    toast({
      title: "Eliminado",
      description: "El usuario ha sido removido de la base de datos.",
    });
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>

        <Card
          className={`border-2 transition-all ${editingId ? "border-orange-500 shadow-lg" : "border-primary/10"}`}
        >
          <CardHeader>
            <CardTitle>
              {editingId ? "Editar Usuario" : "Nuevo Usuario"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Rol</Label>
                <Select value={rol} onValueChange={(v: any) => setRol(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Usuario</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4 flex gap-2">
                <Button
                  type="submit"
                  className={
                    editingId ? "bg-orange-600 hover:bg-orange-700" : ""
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Guardar Cambios" : "Crear Usuario"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <h3 className="font-bold text-lg">Lista de Usuarios</h3>
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div>
                <p className="font-bold">{u.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {u.email} -{" "}
                  <span className="capitalize font-semibold">{u.rol}</span>
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(u)}
                  className="text-blue-500"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUser(u.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
