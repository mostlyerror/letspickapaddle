import { prisma } from '@/lib/prisma';

interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  weightOz: number | null;
  powerRating: number | null;
  controlRating: number | null;
  spinRating: number | null;
  imageUrl: string | null;
}

export default async function PaddlesPage() {
  const paddles = await prisma.paddle.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Pickleball Paddles</h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse our collection of {paddles.length} paddles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paddles.map((paddle) => (
            <div
              key={paddle.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{paddle.name}</h3>
                    <p className="text-sm text-gray-600">{paddle.brand}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ${(paddle.priceCents / 100).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {paddle.weightOz && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{paddle.weightOz} oz</span>
                    </div>
                  )}

                  {paddle.powerRating && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Power:</span>
                      <span className="font-medium">{paddle.powerRating}/10</span>
                    </div>
                  )}

                  {paddle.controlRating && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Control:</span>
                      <span className="font-medium">{paddle.controlRating}/10</span>
                    </div>
                  )}

                  {paddle.spinRating && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spin:</span>
                      <span className="font-medium">{paddle.spinRating}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
