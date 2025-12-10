'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import TiptoneCard from './TiptoneCard';
import type { Tiptone } from '@/types/tiptone';

const PAGE_SIZE = 12;

export default function TiptoneFeed() {
  const [tiptones, setTiptones] = useState<Tiptone[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const prevSearchRef = useRef(search);

  const loadMore = useCallback(async () => {
    // Use ref to prevent race conditions
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        offset: offsetRef.current.toString(),
      });
      if (search) {
        params.set('search', search);
      }

      const res = await fetch(`/api/tiptones?${params}`);
      const data = await res.json();

      if (data.tiptones.length === 0) {
        setHasMore(false);
      } else {
        // Deduplicate by ID when adding new tiptones
        setTiptones((prev) => {
          const existingIds = new Set(prev.map(t => t.id));
          const newTiptones = data.tiptones.filter((t: Tiptone) => !existingIds.has(t.id));
          return [...prev, ...newTiptones];
        });
        offsetRef.current += data.tiptones.length;
        if (data.tiptones.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading tiptones:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, search]);

  // Reset when search changes
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search;
      setTiptones([]);
      offsetRef.current = 0;
      setHasMore(true);
      loadingRef.current = false;
    }
  }, [search]);

  // Initial load
  useEffect(() => {
    if (tiptones.length === 0 && hasMore && !loadingRef.current) {
      loadMore();
    }
  }, [tiptones.length, hasMore, loadMore]);

  // Infinite scroll observer
  useEffect(() => {
    const currentLoader = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loadMore]);

  if (tiptones.length === 0 && !loading) {
    return (
      <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
        {search ? `No tiptones found for "${search}"` : 'No tiptones yet. Be the first to add one!'}
      </p>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
        {tiptones.map((tiptone) => (
          <TiptoneCard key={tiptone.id} tiptone={tiptone} />
        ))}
      </div>

      <div ref={loaderRef} style={{ padding: '20px', textAlign: 'center' }}>
        {loading && <span>Loading...</span>}
        {!hasMore && tiptones.length > 0 && (
          <span style={{ color: '#999' }}>End of list</span>
        )}
      </div>
    </div>
  );
}
