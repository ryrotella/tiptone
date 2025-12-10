export interface Tiptone {
  id: string;
  name: string;
  catalog_number: string; // e.g., "01-0001"
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
  view_count: number;
  created_at: string;
  is_featured: boolean;
}

export interface TiptoneSubmission {
  name: string;
  hex: string;
}
