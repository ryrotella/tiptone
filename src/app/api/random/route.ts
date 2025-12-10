import { NextResponse } from 'next/server';
import { getRandomTiptone } from '@/lib/supabase';

export async function GET() {
  const tiptone = await getRandomTiptone();

  if (!tiptone) {
    return NextResponse.json({ error: 'No tiptones found' }, { status: 404 });
  }

  return NextResponse.json({ id: tiptone.id });
}
