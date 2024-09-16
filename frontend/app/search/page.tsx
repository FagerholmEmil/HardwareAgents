'use client';

import { useSearchParams } from 'next/navigation';
import DronePreferencesForm from '@/components/DronePreferencesForm';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <>
      {query.toLowerCase() === 'fpv' ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <DronePreferencesForm />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1>Search Results for: {query}</h1>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div><LoadingSpinner /></div>}>
      <SearchContent />
    </Suspense>
  );
}