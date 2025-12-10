'use client';

import Link from 'next/link';
import type { Tiptone } from '@/types/tiptone';

interface TiptoneCardProps {
  tiptone: Tiptone;
  compact?: boolean;
}

export default function TiptoneCard({ tiptone, compact = false }: TiptoneCardProps) {
  if (compact) {
    return (
      <Link
        href={`/tiptone/${tiptone.id}`}
        className="panel block no-underline"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="flex gap-2">
          <div
            className="color-swatch"
            style={{
              backgroundColor: tiptone.hex,
              width: '40px',
              height: '40px',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 'bold', fontSize: '11px' }}>
              {tiptone.name}
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              {tiptone.catalog_number}
            </div>
            <div style={{ fontSize: '10px', color: '#888' }}>
              {tiptone.hex}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tiptone/${tiptone.id}`}
      className="panel block"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="color-swatch"
        style={{
          backgroundColor: tiptone.hex,
          width: '100%',
          height: '80px',
        }}
      />
      <div style={{ padding: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
          {tiptone.name}
        </div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          {tiptone.catalog_number}
        </div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
          {tiptone.hex}
        </div>
        <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
          Views: {tiptone.view_count}
        </div>
      </div>
    </Link>
  );
}
