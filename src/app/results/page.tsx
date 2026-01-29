'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Recommendation {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  powerRating: number | null;
  controlRating: number | null;
  spinRating: number | null;
  weightOz: number | null;
  imageUrl: string | null;
  score: number;
  matchReasons: string[];
  affiliateUrls?: any;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchRecommendations();
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchRecommendations = async () => {
    try {
      // First, get the quiz responses
      const responseRes = await fetch(`/api/quiz/responses?sessionId=${sessionId}`);
      const responseData = await responseRes.json();

      if (!responseData.success) {
        throw new Error('Failed to load quiz responses');
      }

      // Then, get recommendations
      const recommendRes = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: responseData.data.responses,
        }),
      });

      const recommendData = await recommendRes.json();

      if (recommendData.success) {
        setRecommendations(recommendData.data);
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Analyzing your preferences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <a href="/quiz" className="text-blue-600 hover:underline">
            Take the quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Perfect Paddle Matches</h1>
          <p className="text-lg text-gray-600">
            Based on your preferences, here are the top {recommendations.length} paddles for you
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map((paddle, index) => (
            <div
              key={paddle.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:flex">
                {/* Paddle Image */}
                <div className="md:w-64 md:flex-shrink-0 bg-gray-100 flex items-center justify-center p-6">
                  <img
                    src={paddle.imageUrl || '/paddle-placeholder.png'}
                    alt={paddle.name}
                    className="w-full h-auto max-w-[200px] object-contain"
                  />
                </div>

                {/* Paddle Details */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-blue-600">#{index + 1}</div>
                        <div className="text-sm text-gray-600">Match</div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{paddle.name}</h2>
                        <p className="text-lg text-gray-600">{paddle.brand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        ${(paddle.priceCents / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {paddle.score}% Match
                      </div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Why this paddle?</h3>
                    <ul className="space-y-2">
                      {paddle.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {paddle.weightOz && (
                        <div>
                          <div className="text-sm text-gray-600">Weight</div>
                          <div className="font-medium">{paddle.weightOz} oz</div>
                        </div>
                      )}
                      {paddle.powerRating && (
                        <div>
                          <div className="text-sm text-gray-600">Power</div>
                          <div className="font-medium">{paddle.powerRating}/10</div>
                        </div>
                      )}
                      {paddle.controlRating && (
                        <div>
                          <div className="text-sm text-gray-600">Control</div>
                          <div className="font-medium">{paddle.controlRating}/10</div>
                        </div>
                      )}
                      {paddle.spinRating && (
                        <div>
                          <div className="text-sm text-gray-600">Spin</div>
                          <div className="font-medium">{paddle.spinRating}/10</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                {paddle.affiliateUrls?.amazon && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={paddle.affiliateUrls.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-orange-500 text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Buy on Amazon - ${(paddle.priceCents / 100).toFixed(2)}
                    </a>
                  </div>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/quiz"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Quiz Again
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <ResultsContent />
    </Suspense>
  );
}
