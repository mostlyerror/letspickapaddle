'use client';

import { useState, useEffect } from 'react';
import { PaddleRecommendation } from '@/components/paddle/PaddleRecommendation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useWidgetTheme } from './WidgetThemeProvider';

interface WidgetResultsProps {
  sessionId: string;
  partnerId?: string;
  onPurchaseClick?: (retailer: string, url: string) => void;
}

export function WidgetResults({ sessionId, partnerId, onPurchaseClick }: WidgetResultsProps) {
  const theme = useWidgetTheme();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
    trackEvent('result_view');
  }, []);

  async function fetchRecommendations() {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, partnerId }),
      });
      if (!res.ok) throw new Error('Failed to load recommendations');
      const data = await res.json();
      setRecommendations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }

  async function trackEvent(eventType: string, eventData?: any) {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          sessionId,
          eventType,
          eventData,
        }),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }

  function handlePurchaseClick(retailer: string, url: string) {
    trackEvent('purchase_click', { retailer });
    if (onPurchaseClick) {
      onPurchaseClick(retailer, url);
    } else {
      window.open(url, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (recommendations.length === 0) {
    return <ErrorMessage message="No recommendations found" />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Perfect Paddles</h1>
        <p className="text-gray-600">
          Based on your preferences, here are our top {recommendations.length} recommendations
        </p>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <PaddleRecommendation
            key={rec.paddle.id}
            recommendation={rec}
            rank={index + 1}
            onPurchaseClick={handlePurchaseClick}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
