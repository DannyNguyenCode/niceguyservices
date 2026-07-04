"use client";

const STORAGE_KEY = "np-pet-favorites";

export function getFavoritePetIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isPetFavorite(id: string): boolean {
  return getFavoritePetIds().includes(id);
}

export function togglePetFavorite(id: string): boolean {
  const current = getFavoritePetIds();
  const next = current.includes(id)
    ? current.filter((petId) => petId !== id)
    : [...current, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.includes(id);
}
