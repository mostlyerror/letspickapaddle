interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  powerRating?: number | null;
  controlRating?: number | null;
  spinRating?: number | null;
  weightOz?: number | null;
  sweetSpotSize?: string | null;
  imageUrl?: string | null;
}

interface PaddleComparisonProps {
  paddles: Paddle[];
  theme?: {
    primaryColor?: string;
  };
}

export function PaddleComparison({ paddles, theme }: PaddleComparisonProps) {
  if (paddles.length < 2) {
    return null;
  }

  const primaryColor = theme?.primaryColor || '#2563eb';

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            {paddles.map((paddle) => (
              <th
                key={paddle.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {paddle.brand}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Paddle
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {paddle.imageUrl && (
                    <img
                      src={paddle.imageUrl}
                      alt={paddle.name}
                      className="h-16 w-16 object-contain mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{paddle.name}</div>
                    <div className="text-sm text-gray-500">{paddle.brand}</div>
                  </div>
                </div>
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Price
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${(paddle.priceCents / 100).toFixed(2)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Power
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap">
                {paddle.powerRating ? (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(paddle.powerRating / 10) * 100}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{paddle.powerRating}/10</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Control
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap">
                {paddle.controlRating ? (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(paddle.controlRating / 10) * 100}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{paddle.controlRating}/10</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Spin
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap">
                {paddle.spinRating ? (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(paddle.spinRating / 10) * 100}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{paddle.spinRating}/10</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Weight
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {paddle.weightOz ? `${paddle.weightOz} oz` : 'N/A'}
              </td>
            ))}
          </tr>

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Sweet Spot
            </td>
            {paddles.map((paddle) => (
              <td key={paddle.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {paddle.sweetSpotSize || 'N/A'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
