'use client';

import { useSearchParams } from 'next/navigation';
import DronePreferencesForm from '@/components/DronePreferencesForm';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {query.toLowerCase() === 'fpv' ? (
        <DronePreferencesForm />
      ) : (
        <h1>Search Results for: {query}</h1>
      )}
    </div>
  );
}