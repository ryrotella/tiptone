'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn"
      style={{ marginRight: '10px' }}
    >
      Print Tiptone
    </button>
  );
}
