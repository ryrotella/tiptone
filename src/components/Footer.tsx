export default function Footer() {
  return (
    <footer
      style={{
        background: '#e0e0e0',
        borderTop: '1px solid #c0c0c0',
        padding: '15px 10px',
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#666',
      }}
    >
      <div className="container">
        <p style={{ margin: '0 0 5px 0' }}>
          TIPTONE - Universal Tip Color System
        </p>
        <p style={{ margin: '0' }}>
          Community-driven. Open source. For everyone.
        </p>
      </div>
    </footer>
  );
}
