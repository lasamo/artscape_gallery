import { Painting, Collection } from "@/types/gallery";
import { v4 as uuidv4 } from "uuid";

const PAINTINGS_KEY = "gallery_paintings";
const COLLECTIONS_KEY = "gallery_collections";

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getPaintings(): Painting[] {
  return load<Painting>(PAINTINGS_KEY, []);
}

export function addPainting(p: Omit<Painting, "id" | "createdAt">): Painting {
  const paintings = getPaintings();
  const newP: Painting = { ...p, id: uuidv4(), createdAt: new Date().toISOString() };
  paintings.push(newP);
  save(PAINTINGS_KEY, paintings);
  return newP;
}

export function updatePainting(id: string, updates: Partial<Painting>): Painting | null {
  const paintings = getPaintings();
  const idx = paintings.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  paintings[idx] = { ...paintings[idx], ...updates };
  save(PAINTINGS_KEY, paintings);
  return paintings[idx];
}

export function deletePainting(id: string) {
  const paintings = getPaintings().filter((p) => p.id !== id);
  save(PAINTINGS_KEY, paintings);
}

export function getCollections(): Collection[] {
  return load<Collection>(COLLECTIONS_KEY, []);
}

export function addCollection(c: Omit<Collection, "id" | "createdAt">): Collection {
  const collections = getCollections();
  const newC: Collection = { ...c, id: uuidv4(), createdAt: new Date().toISOString() };
  collections.push(newC);
  save(COLLECTIONS_KEY, collections);
  return newC;
}

export function updateCollection(id: string, updates: Partial<Collection>): Collection | null {
  const collections = getCollections();
  const idx = collections.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  collections[idx] = { ...collections[idx], ...updates };
  save(COLLECTIONS_KEY, collections);
  return collections[idx];
}

export function deleteCollection(id: string) {
  const collections = getCollections().filter((c) => c.id !== id);
  save(COLLECTIONS_KEY, collections);
  // Unassign paintings from this collection
  const paintings = getPaintings().map((p) =>
    p.collectionId === id ? { ...p, collectionId: undefined } : p
  );
  save(PAINTINGS_KEY, paintings);
}
