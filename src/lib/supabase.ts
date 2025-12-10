import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Tiptone, TiptoneSubmission } from '@/types/tiptone';
import { getAllColorFormats } from './colors';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create a lazy-initialized client to avoid build-time errors
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Generate the next catalog number
async function getNextCatalogNumber(): Promise<string> {
  const client = getSupabase();
  if (!client) return '01-0001';

  // Order by catalog_number descending to get the highest number
  // We need to sort properly since "01-0010" should come after "01-0009"
  const { data, error } = await client
    .from('tiptones')
    .select('catalog_number')
    .order('catalog_number', { ascending: false })
    .limit(1);

  console.log('getNextCatalogNumber query result:', { data, error });

  if (error) {
    console.error('Error fetching last catalog number:', error);
    // Try to find an unused number starting from 01-0001
    return await findUnusedCatalogNumber(client);
  }

  if (!data || data.length === 0) {
    return '01-0001';
  }

  const lastNumber = data[0].catalog_number;
  console.log('Last catalog number found:', lastNumber);

  const [prefix, suffix] = lastNumber.split('-').map(Number);

  if (suffix >= 9999) {
    const newPrefix = (prefix + 1).toString().padStart(2, '0');
    return `${newPrefix}-0001`;
  }

  const newSuffix = (suffix + 1).toString().padStart(4, '0');
  return `${prefix.toString().padStart(2, '0')}-${newSuffix}`;
}

// Fallback function to find an unused catalog number
async function findUnusedCatalogNumber(client: SupabaseClient): Promise<string> {
  const { count } = await client
    .from('tiptones')
    .select('*', { count: 'exact', head: true });

  const nextNum = (count || 0) + 1;
  const prefix = Math.floor((nextNum - 1) / 9999) + 1;
  const suffix = ((nextNum - 1) % 9999) + 1;

  return `${prefix.toString().padStart(2, '0')}-${suffix.toString().padStart(4, '0')}`;
}

export async function createTiptone(submission: TiptoneSubmission): Promise<{ tiptone: Tiptone | null; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { tiptone: null, error: 'Supabase client not initialized' };
  }

  const catalogNumber = await getNextCatalogNumber();
  const colors = getAllColorFormats(submission.hex);

  console.log('Inserting tiptone with catalog number:', catalogNumber);

  const { data, error } = await client
    .from('tiptones')
    .insert({
      name: submission.name.toUpperCase(),
      catalog_number: catalogNumber,
      hex: colors.hex,
      rgb_r: colors.rgb.r,
      rgb_g: colors.rgb.g,
      rgb_b: colors.rgb.b,
      hsl_h: colors.hsl.h,
      hsl_s: colors.hsl.s,
      hsl_l: colors.hsl.l,
      hsv_h: colors.hsv.h,
      hsv_s: colors.hsv.s,
      hsv_v: colors.hsv.v,
      cmyk_c: colors.cmyk.c,
      cmyk_m: colors.cmyk.m,
      cmyk_y: colors.cmyk.y,
      cmyk_k: colors.cmyk.k,
      view_count: 0,
      is_featured: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating tiptone:', error);
    return { tiptone: null, error: `${error.message} (Code: ${error.code})` };
  }

  return { tiptone: mapDbToTiptone(data) };
}

export async function getTiptone(id: string): Promise<Tiptone | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('tiptones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tiptone:', error);
    return null;
  }

  return mapDbToTiptone(data);
}

export async function incrementViewCount(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  await client.rpc('increment_view_count', { tiptone_id: id });
}

export async function getTiptones(options: {
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'view_count';
  featured?: boolean;
  search?: string;
}): Promise<{ tiptones: Tiptone[]; total: number }> {
  const client = getSupabase();
  if (!client) return { tiptones: [], total: 0 };

  let query = client
    .from('tiptones')
    .select('*', { count: 'exact' });

  if (options.featured) {
    query = query.eq('is_featured', true);
  }

  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  if (options.orderBy === 'view_count') {
    query = query.order('view_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching tiptones:', error);
    return { tiptones: [], total: 0 };
  }

  return {
    tiptones: data?.map(mapDbToTiptone) || [],
    total: count || 0,
  };
}

export async function getRandomTiptone(): Promise<Tiptone | null> {
  const client = getSupabase();
  if (!client) return null;

  // Get total count first
  const { count } = await client
    .from('tiptones')
    .select('*', { count: 'exact', head: true });

  if (!count || count === 0) return null;

  // Get a random offset
  const randomOffset = Math.floor(Math.random() * count);

  const { data, error } = await client
    .from('tiptones')
    .select('*')
    .range(randomOffset, randomOffset)
    .single();

  if (error) {
    console.error('Error fetching random tiptone:', error);
    return null;
  }

  return mapDbToTiptone(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToTiptone(data: any): Tiptone {
  return {
    id: data.id,
    name: data.name,
    catalog_number: data.catalog_number,
    hex: data.hex,
    rgb: { r: data.rgb_r, g: data.rgb_g, b: data.rgb_b },
    hsl: { h: data.hsl_h, s: data.hsl_s, l: data.hsl_l },
    hsv: { h: data.hsv_h, s: data.hsv_s, v: data.hsv_v },
    cmyk: { c: data.cmyk_c, m: data.cmyk_m, y: data.cmyk_y, k: data.cmyk_k },
    view_count: data.view_count,
    created_at: data.created_at,
    is_featured: data.is_featured,
  };
}
