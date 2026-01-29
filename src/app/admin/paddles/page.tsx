import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPaddlesPage() {
  const paddles = await prisma.paddle.findMany({
    orderBy: [{ brand: 'asc' }, { name: 'asc' }],
  });

  const paddlesWithStatus = paddles.map((paddle) => {
    const affiliateUrls = paddle.affiliateUrls
      ? JSON.parse(paddle.affiliateUrls)
      : {};

    const hasAmazonLink = Boolean(affiliateUrls.amazon);

    return {
      ...paddle,
      hasAmazonLink,
    };
  });

  const totalPaddles = paddles.length;
  const paddlesWithLinks = paddlesWithStatus.filter((p) => p.hasAmazonLink).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Paddle Affiliate Links
          </h1>
          <p className="text-gray-600">
            Add Amazon product URLs to enable affiliate link tracking for partners
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Paddles</div>
              <div className="text-3xl font-bold text-gray-900">{totalPaddles}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">With Amazon Links</div>
              <div className="text-3xl font-bold text-green-600">{paddlesWithLinks}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Missing Links</div>
              <div className="text-3xl font-bold text-orange-600">
                {totalPaddles - paddlesWithLinks}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/admin/paddles/import-full"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            📦 Import Full Paddle Data
          </Link>
          <Link
            href="/admin/paddles/import"
            className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            🔗 Import Amazon URLs Only
          </Link>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(
                Object.fromEntries(
                  paddles.map((p) => {
                    const urls = p.affiliateUrls ? JSON.parse(p.affiliateUrls) : {};
                    return [p.name, urls.amazon || ''];
                  })
                ),
                null,
                2
              )
            )}`}
            download="paddle-amazon-links.json"
            className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Export JSON
          </a>
        </div>

        {/* Paddles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paddle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amazon Link
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paddlesWithStatus.map((paddle) => (
                <tr key={paddle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 mr-3">
                        {paddle.imageUrl ? (
                          <img
                            src={paddle.imageUrl}
                            alt={paddle.name}
                            className="h-12 w-12 object-contain rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {paddle.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{paddle.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      ${(paddle.priceCents / 100).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {paddle.hasAmazonLink ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Set
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ✗ Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/paddles/${paddle.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            How to use this admin panel
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Edit" to add/update Amazon URL for individual paddles</li>
            <li>• Use "Import JSON" to bulk update Amazon URLs from a JSON file</li>
            <li>• Use "Export JSON" to download current links for backup or editing</li>
            <li>
              • Amazon URLs should be in format: https://www.amazon.com/dp/ASIN
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
