import artworksJson from "../data/artworks.json";
import type { Artwork } from "../../src/lib/types.ts";

export const artworks = artworksJson as Artwork[];

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}
