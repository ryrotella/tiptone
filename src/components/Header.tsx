import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header
      style={{
        background: '#ffffff',
        padding: '15px 20px',
      }}
    >
      <div className="container flex justify-between items-center">
        <Link href="/">
          <Image
            src="/TIPTONE.png"
            alt="TIPTONE"
            width={180}
            height={40}
            style={{ height: 'auto' }}
            priority
          />
        </Link>
        <nav className="flex gap-4 items-center" style={{ fontSize: '24px' }}>
          <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>HOME</Link>
          <Link href="/tips" style={{ color: '#000000', textDecoration: 'none' }}>TIPS</Link>
          <Link href="/about" style={{ color: '#000000', textDecoration: 'none' }}>ABOUT</Link>
          <Link
            href="/donate"
            style={{
              color: '#ffffffff',
              backgroundColor: '#000000',
              textDecoration: 'none',
              border: '1px solid #000000',
              padding: '6px 16px',
              fontSize: '24px',
            }}
          >
            DONATE
          </Link>
        </nav>
      </div>
    </header>
  );
}
