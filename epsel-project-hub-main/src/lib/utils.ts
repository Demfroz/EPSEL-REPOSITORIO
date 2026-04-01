// Utilidad `cn` para combinar clases de forma segura con Tailwind
import { clsx, type ClassValue } from "clsx"; // clsx: construye strings de clases a partir de valores condicionales
import { twMerge } from "tailwind-merge"; // twMerge: resuelve conflictos de clases Tailwind (p. ej. 'p-2 p-4' → 'p-4')

export function cn(...inputs: ClassValue[]) {
  // Primero arma el string de clases con clsx, luego deja solo las clases Tailwind efectivas con twMerge
  return twMerge(clsx(inputs));
}