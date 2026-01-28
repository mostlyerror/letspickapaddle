'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { WidgetQuiz } from '@/components/widget/WidgetQuiz';
import { WidgetThemeProvider } from '@/components/widget/WidgetThemeProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function WidgetQuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const partnerId = searchParams.get('partner');

  const { data: partnerConfig } = useSWR(
    partnerId ? `/api/partners/${partnerId}/config` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    }
  );

  function handleComplete(sessionId: string) {
    router.push(`/widget/results?session=${sessionId}&partner=${partnerId || ''}`);
  }

  return (
    <WidgetThemeProvider theme={partnerConfig?.theme}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <WidgetQuiz
          partnerId={partnerId || undefined}
          curatedPaddleIds={partnerConfig?.curatedPaddles}
          onComplete={handleComplete}
        />
      </div>
    </WidgetThemeProvider>
  );
}

export default function WidgetQuizPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WidgetQuizContent />
    </Suspense>
  );
}
