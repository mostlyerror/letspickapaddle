'use client';

interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  imageUrl?: string | null;
  powerRating?: number | null;
  controlRating?: number | null;
  spinRating?: number | null;
}

interface PaddleCardProps {
  paddle: Paddle;
  onClick?: () => void;
  theme?: {
    primaryColor?: string;
  };
}

export function PaddleCard({ paddle, onClick, theme }: PaddleCardProps) {
  const price = (paddle.priceCents / 100).toFixed(2);

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      {paddle.imageUrl && (
        <div className="aspect-square bg-gray-100">
          <img
            src={paddle.imageUrl}
            alt={paddle.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="text-sm text-gray-600">{paddle.brand}</div>
        <h3 className="font-bold text-lg text-gray-900 mt-1">{paddle.name}</h3>
        <div className="text-xl font-bold text-blue-600 mt-2" style={{ color: theme?.primaryColor }}>
          ${price}
        </div>
        {(paddle.powerRating || paddle.controlRating || paddle.spinRating) && (
          <div className="flex gap-4 mt-3 text-sm">
            {paddle.powerRating && (
              <div>
                <span className="text-gray-600">Power:</span>{' '}
                <span className="font-medium">{paddle.powerRating}/10</span>
              </div>
            )}
            {paddle.controlRating && (
              <div>
                <span className="text-gray-600">Control:</span>{' '}
                <span className="font-medium">{paddle.controlRating}/10</span>
              </div>
            )}
            {paddle.spinRating && (
              <div>
                <span className="text-gray-600">Spin:</span>{' '}
                <span className="font-medium">{paddle.spinRating}/10</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
