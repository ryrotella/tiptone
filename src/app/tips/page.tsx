'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TiptoneCard from '@/components/TiptoneCard';

interface Tiptone {
  id: string;
  name: string;
  hex: string;
  code: string;
  created_at: string;
}

export default function TipsPage() {
  const [tiptones, setTiptones] = useState<Tiptone[]>([]);
  const [filteredTiptones, setFilteredTiptones] = useState<Tiptone[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTiptones() {
      try {
        const res = await fetch('/api/tiptones');
        const data = await res.json();
        if (data.tiptones) {
          setTiptones(data.tiptones);
          setFilteredTiptones(data.tiptones);
        }
      } catch (error) {
        console.error('Error fetching tiptones:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTiptones();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTiptones(tiptones);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTiptones(
        tiptones.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.code.toLowerCase().includes(query) ||
            t.hex.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, tiptones]);

  return (
    <>
      <Header />
      <main style={{ background: '#000000', minHeight: '100vh' }}>
        {/* Enter Your Tip Button */}
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Link
            href="/add"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              fontSize: '14px',
              letterSpacing: '2px',
              backgroundColor: '#ffffff',
              color: '#000000',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            ENTER YOUR TIP
          </Link>
        </section>

        {/* Search */}
        <section style={{ padding: '0 20px 30px' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, code, or color..."
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #333333',
              }}
            />
          </div>
        </section>

        {/* Tiptones Grid */}
        <section style={{ padding: '0 20px 40px' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                Loading Tiptones...
              </div>
            ) : filteredTiptones.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                {searchQuery ? 'No tiptones found matching your search.' : 'No tiptones yet.'}
              </div>
            ) : (
              <div className="tiptone-grid">
                {filteredTiptones.map((tiptone) => (
                  <TiptoneCard key={tiptone.id} tiptone={tiptone} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
