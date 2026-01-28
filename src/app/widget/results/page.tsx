'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { WidgetResults } from '@/components/widget/WidgetResults';
import { WidgetThemeProvider } from '@/components/widget/WidgetThemeProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function WidgetResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const partnerId = searchParams.get('partner');

  const { data: partnerConfig } = useSWR(
    partnerId ? `/api/partners/${partnerId}/config` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    }
  );

  if (!sessionId) {
    return <div className="text-center py-12">Session not found</div>;
  }

  return (
    <WidgetThemeProvider theme={partnerConfig?.theme}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <WidgetResults sessionId={sessionId} partnerId={partnerId || undefined} />
        </div>
      </div>
    </WidgetThemeProvider>
  );
}

export default function WidgetResultsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WidgetResultsContent />
    </Suspense>
  );
}
