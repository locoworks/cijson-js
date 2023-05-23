import { scru128String } from "scru128";

export function generateSCRUId(): string {
  return scru128String().toLowerCase();
}

export function generateSCRUIdWithPrefix(prefix: string): string {
  return `${prefix}_${generateSCRUId()}`;
}
