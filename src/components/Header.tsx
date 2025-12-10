import Link from 'next/link';

export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%)',
        borderBottom: '2px solid #a0a0a0',
        padding: '8px 10px',
      }}
    >
      <div className="container flex justify-between items-center">
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '18px',
            letterSpacing: '2px',
          }}
        >
          TIPTONE
        </Link>
        <nav className="flex gap-3" style={{ fontSize: '12px' }}>
          <Link href="/">Home</Link>
          <Link href="/add">Add a Tiptone</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>
    </header>
  );
}
