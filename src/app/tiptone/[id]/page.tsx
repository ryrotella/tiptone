import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrintButton from '@/components/PrintButton';
import { getTiptone, incrementViewCount } from '@/lib/supabase';

interface TiptonePageProps {
  params: Promise<{ id: string }>;
}

export default async function TiptonePage({ params }: TiptonePageProps) {
  const { id } = await params;
  const tiptone = await getTiptone(id);

  if (!tiptone) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementViewCount(id);

  const formattedDate = new Date(tiptone.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Speak format: "Hard Ryan one two" for 01-0002
  const [prefix, suffix] = tiptone.catalog_number.split('-').map(Number);
  const spokenNumber = `${prefix === 1 ? 'one' : prefix} ${suffix}`;

  return (
    <>
      <Header />
      <main className="container">
        {/* Printable card */}
        <div
          className="panel"
          style={{
            maxWidth: '500px',
            margin: '20px auto',
          }}
        >
          {/* Color swatch - large and prominent */}
          <div
            style={{
              backgroundColor: tiptone.hex,
              height: '200px',
              borderBottom: '1px solid #c0c0c0',
            }}
          />

          {/* Tiptone info */}
          <div style={{ padding: '20px' }}>
            {/* Name and catalog number */}
            <div style={{ marginBottom: '15px' }}>
              <h1 style={{ fontSize: '28px', marginBottom: '5px', letterSpacing: '1px' }}>
                {tiptone.name} {tiptone.catalog_number}
              </h1>
              <div style={{ fontSize: '18px', color: '#666', fontWeight: 'bold' }}>
                
              </div>
                    {/* Metadata */}
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div className="flex justify-between">
                <span>Date Added:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between" style={{ marginTop: '3px' }}>
                <span>Views:</span>
                <span>{tiptone.view_count.toLocaleString()}</span>
              </div>
              {tiptone.is_featured && (
                <div style={{ marginTop: '8px', color: '#4a90d9', fontWeight: 'bold' }}>
                  Featured Tiptone
                </div>
              )}
            </div>
            </div>

            <hr />

            {/* Color values table */}
            <table style={{ width: '100%', marginBottom: '15px' }}>
              <tbody>
                <tr>
                  <th style={{ width: '80px' }}>Hex</th>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    {tiptone.hex}
                  </td>
                </tr>
                <tr>
                  <th>RGB</th>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    rgb({tiptone.rgb.r}, {tiptone.rgb.g}, {tiptone.rgb.b})
                  </td>
                </tr>
                <tr>
                  <th>HSL</th>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    hsl({tiptone.hsl.h}, {tiptone.hsl.s}%, {tiptone.hsl.l}%)
                  </td>
                </tr>
                <tr>
                  <th>HSV/HSB</th>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    hsv({tiptone.hsv.h}, {tiptone.hsv.s}%, {tiptone.hsv.v}%)
                  </td>
                </tr>
                <tr>
                  <th>CMYK</th>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    cmyk({tiptone.cmyk.c}%, {tiptone.cmyk.m}%, {tiptone.cmyk.y}%, {tiptone.cmyk.k}%)
                  </td>
                </tr>
              </tbody>
            </table>

            <hr />

   
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mb-4">
          <PrintButton />
          <a href="/" className="btn">
            Back to Home
          </a>
        </div>

        {/* Print styles */}
        <style>{`
          @media print {
            header, footer, .btn, a.btn {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .container {
              max-width: 100% !important;
              padding: 0 !important;
            }
            .panel {
              border: 2px solid #000 !important;
              max-width: 100% !important;
              margin: 0 !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
