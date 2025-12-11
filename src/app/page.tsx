import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TiptoneCard from '@/components/TiptoneCard';
import { getTiptones } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

// Loading component for Suspense fallback
function GridLoading() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      Loading Tiptones...
    </div>
  );
}

export default async function Home() {
  // Fetch tiptones for the grid display
  const { tiptones } = await getTiptones({ limit: 100 });

  return (
    <>
      <Header />
      <main style={{ background: '#000000', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section
          style={{
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <h1 className="hero-title">
            UNLIMITED TIPS,<br />
            IN THE PALM OF YOUR HAND
          </h1>
        </section>

        {/* Tiptone Grid - 6 per row, scrollable */}
        <section style={{ padding: '0 20px 40px' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <Suspense fallback={<GridLoading />}>
              <div className="tiptone-grid">
                {tiptones.map((tiptone) => (
                  <TiptoneCard key={tiptone.id} tiptone={tiptone} />
                ))}
              </div>
            </Suspense>
          </div>
        </section>

        {/* CTA Button */}
        <section style={{ padding: '20px', textAlign: 'center', paddingBottom: '60px' }}>
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
      </main>
      <Footer />
    </>
  );
}
