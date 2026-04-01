export type TipoProyecto =
  | "sgo"
  | "sge"
  | "servicio"
  | "elaboracion_tdr"
  | "sgmr_ap"
  | "sgmr_alc";
export type FiltroProyecto = "todos" | TipoProyecto;

export type AreaGerencia =
  | "Gerencia Comercial"
  | "Gerencia de Proyectos y Obras"
  | "Gerencia Operacional";

export type RolUsuario = "admin" | "usuario";

export interface Proyecto {
  id: string;
  nombre: string;
  tipo: TipoProyecto;
  descripcion: string;
  fecha: string;
  ingenieroSupervisor: string;
  registradoPor: string;
  area: AreaGerencia;
  empresaEjecutora: string;
  conexionesDomiciliares: number;
  metrosLinealesAgua: number;
  metrosLinealesAlcantarillado: number;
  costoProyecto: number;
  archivos: ArchivoProyecto[];
}

export interface ArchivoProyecto {
  id: string;
  nombre: string;
  tipo: "pdf" | "rar" | "jpg";
  url: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface UsuarioExcel extends Usuario {
  password: string;
}
