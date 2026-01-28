interface Paddle {
  name: string;
  brand: string;
  imageUrl?: string | null;
  priceCents: number;
}

interface ResultCardProps {
  paddle: Paddle;
  sessionId: string;
  theme?: {
    primaryColor?: string;
    logoUrl?: string;
    partnerName?: string;
  };
}

export function ResultCard({ paddle, sessionId, theme }: ResultCardProps) {
  const primaryColor = theme?.primaryColor || '#2563eb';
  const logoUrl = theme?.logoUrl;
  const partnerName = theme?.partnerName || 'PaddleFit';

  return (
    <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        {logoUrl ? (
          <img src={logoUrl} alt={partnerName} className="h-8 w-auto object-contain" />
        ) : (
          <div className="text-xl font-bold" style={{ color: primaryColor }}>
            {partnerName}
          </div>
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Perfect Paddle Match</h2>
        <p className="text-gray-600">Found with PaddleFit Quiz</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {paddle.imageUrl && (
          <div className="mb-4">
            <img
              src={paddle.imageUrl}
              alt={paddle.name}
              className="w-full h-48 object-contain"
            />
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{paddle.name}</h3>
        <p className="text-gray-600 mb-2">{paddle.brand}</p>
        <div className="text-2xl font-bold" style={{ color: primaryColor }}>
          ${(paddle.priceCents / 100).toFixed(2)}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">What's YOUR perfect paddle?</p>
        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
          <span>Take the quiz at PaddleFit.co</span>
        </div>
      </div>
    </div>
  );
}
