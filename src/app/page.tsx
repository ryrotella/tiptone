import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TiptoneCard from '@/components/TiptoneCard';
import TiptoneFeed from '@/components/TiptoneFeed';
import SearchBox from '@/components/SearchBox';
import RandomButton from '@/components/RandomButton';
import { getTiptones } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

// Loading component for Suspense fallback
function FeedLoading() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
      Loading Tiptones...
    </div>
  );
}

export default async function Home() {
  // Fetch data on the server
  const [featuredResult, trendingResult] = await Promise.all([
    getTiptones({ featured: true, limit: 5 }),
    getTiptones({ orderBy: 'view_count', limit: 6 }),
  ]);

  const featuredTiptones = featuredResult.tiptones;
  const trendingTiptones = trendingResult.tiptones;

  return (
    <>
      <Header />
      <main className="container">
        {/* Hero Section */}
        <section
          className="panel text-center"
          style={{ padding: '30px 20px', marginTop: '10px' }}
        >
          <h1 style={{ fontSize: '32px', letterSpacing: '3px', marginBottom: '10px' }}>
            TIPTONE
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Universal Tip Color System
          </p>
          <Link href="/add" className="btn btn-primary" style={{ fontSize: '14px', padding: '8px 20px' }}>
            + Add a Tiptone
          </Link>
        </section>

        {/* What is Tiptone */}
        <section className="panel" id="about">
          <div className="panel-header">What is Tiptone?</div>
          <div className="panel-content">
            <p>
              <strong>TIPTONE</strong> is a community-driven, open-source organization providing
              a universal tip color language. The Tiptone Matching System (TMS) is a standardized
              database of tip colors for design, printing, fashion, and manufacturing, ensuring
              consistent color reproduction across different materials and devices.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Key Characteristics:</strong>
            </p>
            <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
              <li>Community and user-driven</li>
              <li>Ongoing and ever-growing project</li>
              <li>Open source - anyone can contribute</li>
              <li>Strength increases with more user data</li>
            </ul>
          </div>
        </section>

        {/* How are Tiptones Determined */}
        <section className="panel">
          <div className="panel-header">How are Tiptones Determined?</div>
          <div className="panel-content">
            <p>
              Tiptones are determined by analyzing the color of the upper lip center.
              A machine learning model extracts the tip color from uploaded face images
              by detecting facial landmarks and precisely identifying the central point
              of the upper lip.
            </p>
            <p style={{ marginBottom: 0 }}>
              Users can adjust the selection point if needed, ensuring accuracy.
              The extracted color is then converted to multiple color formats
              (Hex, RGB, HSL, HSV, CMYK) for universal compatibility.
            </p>
          </div>
        </section>

        {/* Who Created Tiptone */}
        <section className="panel">
          <div className="panel-header">Who Created Tiptone?</div>
          <div className="panel-content">
            <p style={{ marginBottom: 0 }}>
              Tiptone was created as an open-source community project to establish
              a universal language for skin tip colors. The project is maintained
              by contributors worldwide who believe in accessible, standardized
              color documentation.
            </p>
          </div>
        </section>

        {/* Featured Tiptones of the Month */}
        {featuredTiptones.length > 0 && (
          <section className="panel">
            <div className="panel-header">Featured Tiptones of the Month</div>
            <div className="panel-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {featuredTiptones.map((tiptone) => (
                  <TiptoneCard key={tiptone.id} tiptone={tiptone} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Tiptones */}
        {trendingTiptones.length > 0 && (
          <section className="panel">
            <div className="panel-header">Trending Tiptones</div>
            <div className="panel-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {trendingTiptones.map((tiptone) => (
                  <TiptoneCard key={tiptone.id} tiptone={tiptone} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Section */}
        <section className="panel">
          <div className="panel-header">Search Tiptones</div>
          <div className="panel-content">
            <div className="flex gap-2 items-center">
              <SearchBox />
              <RandomButton />
            </div>
          </div>
        </section>

        {/* Infinite Scroll Feed */}
        <section className="panel">
          <div className="panel-header">All Tiptones</div>
          <div className="panel-content">
            <Suspense fallback={<FeedLoading />}>
              <TiptoneFeed />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
