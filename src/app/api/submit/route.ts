import { NextRequest, NextResponse } from 'next/server';
import { createTiptone, isSupabaseConfigured } from '@/lib/supabase';
import { validateTiptoneName, formatTiptoneName } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        error: 'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      }, { status: 500 });
    }

    const body = await request.json();
    const { name, hex } = body;

    console.log('Received submission:', { name, hex });

    // Validate name
    const validation = validateTiptoneName(name);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Validate hex color
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      return NextResponse.json({ error: 'Invalid hex color format' }, { status: 400 });
    }

    // Format and create tiptone
    const formattedName = formatTiptoneName(name);
    console.log('Creating tiptone with name:', formattedName);

    const result = await createTiptone({ name: formattedName, hex });

    if (!result.tiptone) {
      return NextResponse.json({
        error: result.error || 'Failed to create tiptone. Check server logs for details.'
      }, { status: 500 });
    }

    return NextResponse.json({ tiptone: result.tiptone, success: true });
  } catch (error) {
    console.error('Error submitting tiptone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
