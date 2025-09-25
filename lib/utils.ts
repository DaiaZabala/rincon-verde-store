// app/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusiona clases de Tailwind sin duplicados
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

// Convierte objetos con BigInt u otros tipos no serializables en JSON seguro
export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

