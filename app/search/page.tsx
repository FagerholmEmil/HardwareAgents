'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || 'No query provided';

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-center text-gray-800">
        Search results for: {query}
      </h1>
    </div>
  );
}
