import * as XLSX from "xlsx";
import { proyectosMock } from "./mock-data";
import { Proyecto, TipoProyecto, UsuarioExcel } from "./types";

const USERS_KEY = "epsel_excel_users";
const PROJECTS_KEY = "epsel_excel_projects";

const defaultUsers: UsuarioExcel[] = [
  {
    id: "1",
    nombre: "HAROLD",
    email: "harold@gmail.com",
    password: "admin123",
    rol: "admin",
  },
  {
    id: "2",
    nombre: "Usuario EPSEL",
    email: "usuario@epsel.gob.pe",
    password: "user123",
    rol: "usuario",
  },
  {
    id: "3",
    nombre: "JUAN",
    email: "kif@gmail.com",
    password: "321",
    rol: "usuario",
  },
];

const normalizeTipo = (value: string): TipoProyecto => {
  const v = value.trim().toLowerCase();
  if (v === "s.g.o." || v === "sgo") return "sgo";
  if (v === "s.g.e." || v === "sge") return "sge";
  if (v === "elaboracion tdr" || v === "elaboración tdr" || v === "tdr")
    return "elaboracion_tdr";
  if (v === "sgmr ap" || v === "sgmr_ap") return "sgmr_ap";
  if (v === "sgmr alc" || v === "sgmr_alc") return "sgmr_alc";
  return "servicio";
};

// Gestión de usuarios (lectura y escritura en LocalStorage)

export function getStoredUsers(): UsuarioExcel[] {
  const raw = localStorage.getItem(USERS_KEY);

  // 1. Si no hay NADA en el LocalStorage, cargamos los de defecto por primera vez
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    // 2. Si ya hay datos, retornamos lo que diga el LocalStorage
    // (Aquí es donde se mantienen tus ediciones)
    return JSON.parse(raw) as UsuarioExcel[];
  } catch {
    return defaultUsers;
  }
}

export function saveUsers(users: UsuarioExcel[]) {
  // Guardado directo y definitivo
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

//Gestión de proyectos (similar a usuarios, pero con proyectos)

export function getStoredProjects(): Proyecto[] {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(proyectosMock));
    return proyectosMock;
  }
  try {
    return JSON.parse(raw) as Proyecto[];
  } catch {
    return proyectosMock;
  }
}

export function saveProjects(projects: Proyecto[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// Importación/Exportación de Excel para usuarios y proyectos (usando SheetJS)

export async function importUsersExcel(file: File): Promise<UsuarioExcel[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
  });

  return rows
    .map((r, i): UsuarioExcel | null => {
      const nombre = String(r.nombre || r.Nombre || "").trim();
      const email = String(r.email || r.Email || "")
        .trim()
        .toLowerCase();
      const password = String(r.password || r.Password || "").trim();
      if (!nombre || !email || !password) return null;
      return {
        id: String(r.id || crypto.randomUUID()),
        nombre,
        email,
        password,
        rol:
          String(r.rol || r.Rol || "usuario")
            .trim()
            .toLowerCase() === "admin"
            ? "admin"
            : "usuario",
      };
    })
    .filter((u): u is UsuarioExcel => Boolean(u));
}

export function exportUsersExcel(users: UsuarioExcel[]) {
  const rows = users.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    password: u.password,
    rol: u.rol,
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "usuarios");
  XLSX.writeFile(wb, "usuarios_epsel.xlsx");
}

export async function importProjectsExcel(file: File): Promise<Proyecto[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
  });

  return rows
    .map((r, i) => ({
      id: String(r.id || crypto.randomUUID()),
      nombre: String(r.nombre || r["nombre del proyecto"] || "").trim(),
      tipo: normalizeTipo(String(r.tipo || "servicio")),
      descripcion: String(r.descripcion || "").trim(),
      fecha: String(r.fecha || new Date().toISOString().slice(0, 10)).slice(
        0,
        10,
      ),
      ingenieroSupervisor: String(
        r.ingenieroSupervisor || r.supervisor || "",
      ).trim(),
      registradoPor: String(r.registradoPor || "").trim(),
      area: String(r.area || "Gerencia Operacional").trim() as Proyecto["area"],
      empresaEjecutora: String(r.empresaEjecutora || r.empresa || "").trim(),
      conexionesDomiciliares: Number(r.conexionesDomiciliares || 0),
      metrosLinealesAgua: Number(r.metrosLinealesAgua || 0),
      metrosLinealesAlcantarillado: Number(r.metrosLinealesAlcantarillado || 0),
      costoProyecto: Number(r.costoProyecto || r.costo || 0),
      archivos: [],
    }))
    .filter((p) => p.nombre);
}

export function exportProjectsExcel(projects: Proyecto[]) {
  const rows = projects.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    tipo: p.tipo,
    descripcion: p.descripcion,
    fecha: p.fecha,
    ingenieroSupervisor: p.ingenieroSupervisor,
    registradoPor: p.registradoPor,
    area: p.area,
    empresaEjecutora: p.empresaEjecutora,
    conexionesDomiciliares: p.conexionesDomiciliares,
    metrosLinealesAgua: p.metrosLinealesAgua,
    metrosLinealesAlcantarillado: p.metrosLinealesAlcantarillado,
    costoProyecto: p.costoProyecto,
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "proyectos");
  XLSX.writeFile(wb, "proyectos_epsel.xlsx");
}
