import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonatePage() {
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
            SUPPORT OUR CAUSE
          </h1>

          <div style={{ fontSize: '20px', lineHeight: '1.8', color: '#ffffff' }}>
            <p style={{ marginBottom: '24px', textAlign: 'center', fontSize: '24px' }}>
              TIPTONE proudly supports The Culleton Foundation
            </p>

            <div
              style={{
                background: '#111111',
                border: '1px solid #333333',
                padding: '40px',
                marginBottom: '40px',
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                }}
              >
                THE CULLETON FOUNDATION
              </h2>

              <p style={{ marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                The Culleton Foundation is dedicated to making a positive impact in our
                communities through charitable initiatives, educational programs, and
                support for those in need.
              </p>
            </div>

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
              WHY DONATE?
            </h2>

            <p style={{ marginBottom: '24px' }}>
              Your donation helps The Culleton Foundation continue its mission of supporting
              communities and creating opportunities for those who need it most. Every
              contribution, no matter the size, makes a meaningful difference.
            </p>

            <ul style={{ paddingLeft: '24px', marginBottom: '40px' }}>
              <li style={{ marginBottom: '12px' }}>100% of donations go directly to charitable programs</li>
              <li style={{ marginBottom: '12px' }}>Support education and community development initiatives</li>
              <li style={{ marginBottom: '12px' }}>Help provide resources to underserved communities</li>
              <li style={{ marginBottom: '12px' }}>Be part of a movement creating positive change</li>
            </ul>

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
              HOW TO DONATE
            </h2>

            <p style={{ marginBottom: '32px' }}>
              To make a donation to The Culleton Foundation, please reach out directly
              or visit their official website. Together, we can make a difference.
            </p>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a
                href="mailto:donate@culletonfoundation.org"
                style={{
                  display: 'inline-block',
                  padding: '16px 48px',
                  fontSize: '14px',
                  letterSpacing: '2px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                CONTACT TO DONATE
              </a>
            </div>

            <p
              style={{
                marginTop: '48px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#888888',
              }}
            >
              Thank you for your generosity and support.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
