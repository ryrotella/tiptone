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
        className="tiptone-card"
        style={{ textDecoration: 'none' }}
      >
        <div className="flex gap-2" style={{ padding: '8px' }}>
          <div
            className="swatch"
            style={{
              backgroundColor: tiptone.hex,
              width: '40px',
              height: '40px',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="name" style={{ fontSize: '11px' }}>
              {tiptone.name}
            </div>
            <div className="code">
              {tiptone.catalog_number}
            </div>
            <div className="hex">
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
      className="tiptone-card"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="swatch"
        style={{
          backgroundColor: tiptone.hex,
          width: '100%',
          aspectRatio: '1',
        }}
      />
      <div className="info">
        <div className="name">
          {tiptone.name}
        </div>
        <div className="code" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>TIPTONE: {tiptone.catalog_number}</span>
          <span>{tiptone.hex}</span>
        </div>
      </div>
    </Link>
  );
}
