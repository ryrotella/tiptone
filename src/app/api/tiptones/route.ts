import { NextRequest, NextResponse } from 'next/server';
import { getTiptones } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = parseInt(searchParams.get('offset') || '0');
  const search = searchParams.get('search') || undefined;
  const orderBy = (searchParams.get('orderBy') as 'created_at' | 'view_count') || 'created_at';
  const featured = searchParams.get('featured') === 'true';

  const result = await getTiptones({
    limit,
    offset,
    search,
    orderBy,
    featured: featured || undefined,
  });

  return NextResponse.json(result);
}
