'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlannerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static HTML planner
    router.push('/planner.html');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Loading financial planner...</p>
    </div>
  );
}
