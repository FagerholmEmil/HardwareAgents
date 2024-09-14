'use client';

import DronePreferencesForm from '@/components/DronePreferencesForm';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || 'No query provided';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DronePreferencesForm />
    </div>
  );
}
