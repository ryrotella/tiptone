'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RandomButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/random');
      const data = await res.json();
      if (data.id) {
        router.push(`/tiptone/${data.id}`);
      }
    } catch (error) {
      console.error('Error getting random tiptone:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} className="btn" disabled={loading}>
      {loading ? 'Loading...' : 'Random Tiptone'}
    </button>
  );
}
