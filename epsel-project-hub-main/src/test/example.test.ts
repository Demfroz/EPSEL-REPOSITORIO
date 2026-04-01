// Test de ejemplo usando Vitest para verificar configuración básica
import { describe, expect, it } from "vitest";

// Grupo de tests llamado "example"
describe("example", () => {
  // Caso de prueba muy simple que siempre pasa
  it("should pass", () => {
    expect(true).toBe(true); // Aserción booleana trivial
  });
});