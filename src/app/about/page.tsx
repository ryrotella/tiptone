import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#000000', minHeight: '100vh', padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            ABOUT TIPTONE
          </h1>

          <div style={{ fontSize: '20px', lineHeight: '1.8', color: '#ffffff' }}>
            <p style={{ marginBottom: '24px' }}>
              TIPTONE is a creative platform that transforms everyday tips and advice into
              beautiful, shareable color swatches inspired by the iconic Pantone color system.
            </p>

            <p style={{ marginBottom: '24px' }}>
              Each tip submitted to TIPTONE is assigned a unique color and code, creating a
              visual library of wisdom that can be browsed, shared, and collected.
            </p>

            <p style={{ marginBottom: '24px' }}>
              Whether it&apos;s life advice, cooking tips, productivity hacks, or creative
              inspiration, TIPTONE gives your words a colorful identity that makes them
              memorable and easy to share.
            </p>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '48px',
                marginBottom: '24px',
              }}
            >
              HOW IT WORKS
            </h2>

            <ol style={{ paddingLeft: '24px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}>Submit your tip through our simple form</li>
              <li style={{ marginBottom: '12px' }}>Your tip is assigned a unique color and TIPTONE code</li>
              <li style={{ marginBottom: '12px' }}>Browse the collection and discover tips from others</li>
              <li style={{ marginBottom: '12px' }}>Share your favorites with friends and family</li>
            </ol>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '48px',
                marginBottom: '24px',
              }}
            >
              OUR MISSION
            </h2>

            <p style={{ marginBottom: '24px' }}>
              We believe that good advice deserves to be seen. TIPTONE combines the power of
              color with the wisdom of community to create something beautiful and useful.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
