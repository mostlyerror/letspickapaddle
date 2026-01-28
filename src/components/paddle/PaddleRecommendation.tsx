'use client';

import { PaddleCard } from './PaddleCard';

interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  imageUrl?: string | null;
  powerRating?: number | null;
  controlRating?: number | null;
  spinRating?: number | null;
  affiliateUrls?: string | null;
}

interface Recommendation {
  paddle: Paddle;
  score: number;
  reasoning: string;
  affiliateUrls?: Record<string, string>;
}

interface PaddleRecommendationProps {
  recommendation: Recommendation;
  rank: number;
  onPurchaseClick?: (retailer: string, url: string) => void;
  theme?: {
    primaryColor?: string;
  };
}

export function PaddleRecommendation({
  recommendation,
  rank,
  onPurchaseClick,
  theme,
}: PaddleRecommendationProps) {
  const { paddle, score, reasoning, affiliateUrls } = recommendation;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-2 font-bold" style={{ backgroundColor: theme?.primaryColor }}>
        #{rank} Match - {Math.round(score)}% Compatible
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <PaddleCard paddle={paddle} theme={theme} />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Why this paddle?</h4>
              <p className="text-gray-700">{reasoning}</p>
            </div>
            {affiliateUrls && Object.keys(affiliateUrls).length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Where to buy:</h4>
                <div className="space-y-2">
                  {Object.entries(affiliateUrls).map(([retailer, url]) => (
                    <a
                      key={retailer}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (onPurchaseClick) {
                          e.preventDefault();
                          onPurchaseClick(retailer, url);
                        }
                      }}
                      className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                      style={{ backgroundColor: theme?.primaryColor }}
                    >
                      Buy on {retailer.charAt(0).toUpperCase() + retailer.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
