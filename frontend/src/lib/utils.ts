import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddr(addr?: string, size = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

/** Case-insensitive lookup into a record keyed by 0x-hex handles. */
export function lookupHandle<T>(record: Record<string, T>, handle: string): T | undefined {
  if (handle in record) return record[handle];
  const target = handle.toLowerCase();
  for (const key of Object.keys(record)) {
    if (key.toLowerCase() === target) return record[key];
  }
  return undefined;
}

/** Group a big integer with thin spaces for legibility: 12500 -> "12,500". */
export function groupNumber(value: bigint | number | string): string {
  const s = typeof value === "bigint" ? value.toString() : String(value);
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Deterministic pseudo-ciphertext string for the "locked" placeholder look. */
export function fauxCipher(seed: string, length = 18): string {
  const chars = "0123456789abcdef";
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out += chars[Math.abs(h) % chars.length];
  }
  return out;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
