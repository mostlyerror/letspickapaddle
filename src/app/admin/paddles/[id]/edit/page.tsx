import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function updatePaddleAffiliateUrl(formData: FormData) {
  'use server';

  const paddleId = formData.get('paddleId') as string;
  const amazonUrl = formData.get('amazonUrl') as string;

  // Validate Amazon URL format if provided
  if (amazonUrl && amazonUrl.trim()) {
    const trimmedUrl = amazonUrl.trim();
    if (!trimmedUrl.match(/^https:\/\/(www\.)?amazon\.com\/.+/)) {
      throw new Error('Invalid Amazon URL format. Must be from amazon.com');
    }
  }

  // Get current paddle
  const paddle = await prisma.paddle.findUnique({
    where: { id: paddleId },
  });

  if (!paddle) {
    throw new Error('Paddle not found');
  }

  // Parse current affiliate URLs
  const currentUrls = paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {};

  // Update Amazon URL (or remove if empty)
  if (amazonUrl && amazonUrl.trim()) {
    currentUrls.amazon = amazonUrl.trim();
  } else {
    delete currentUrls.amazon;
  }

  // Save back to database
  await prisma.paddle.update({
    where: { id: paddleId },
    data: {
      affiliateUrls: JSON.stringify(currentUrls),
    },
  });

  redirect('/admin/paddles');
}

export default async function EditPaddlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paddle = await prisma.paddle.findUnique({
    where: { id },
  });

  if (!paddle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paddle Not Found</h1>
          <Link
            href="/admin/paddles"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Paddles
          </Link>
        </div>
      </div>
    );
  }

  const currentUrls = paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {};
  const currentAmazonUrl = currentUrls.amazon || '';

  // Generate preview URL with sample partner ID
  const samplePartnerId = 'yoursite-20';
  let previewUrl = '';
  if (currentAmazonUrl) {
    try {
      const url = new URL(currentAmazonUrl);
      url.searchParams.set('tag', samplePartnerId);
      previewUrl = url.toString();
    } catch {
      previewUrl = currentAmazonUrl;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/paddles"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Paddles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Affiliate Links</h1>
          <p className="text-gray-600">{paddle.name}</p>
        </div>

        {/* Paddle Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Paddle Details</h2>

          <div className="flex gap-6">
            {/* Paddle Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center p-4">
                {paddle.imageUrl ? (
                  <img
                    src={paddle.imageUrl}
                    alt={paddle.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto mb-2"
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
                    <p className="text-sm">No image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Paddle Specs */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Brand:</span>
                  <span className="ml-2 font-medium text-gray-900">{paddle.brand}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    ${(paddle.priceCents / 100).toFixed(2)}
                  </span>
                </div>
                {paddle.weightOz && (
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {paddle.weightOz} oz
                    </span>
                  </div>
                )}
                {paddle.shape && (
                  <div>
                    <span className="text-gray-600">Shape:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {paddle.shape}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Power Rating:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {paddle.powerRating}/10
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Control Rating:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {paddle.controlRating}/10
                  </span>
                </div>
                {paddle.spinRating && (
                  <div>
                    <span className="text-gray-600">Spin Rating:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {paddle.spinRating}/10
                    </span>
                  </div>
                )}
                {paddle.coreMaterial && (
                  <div>
                    <span className="text-gray-600">Core:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {paddle.coreMaterial}
                    </span>
                  </div>
                )}
                {paddle.faceMaterial && (
                  <div>
                    <span className="text-gray-600">Face:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {paddle.faceMaterial}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form action={updatePaddleAffiliateUrl}>
            <input type="hidden" name="paddleId" value={paddle.id} />

            <div className="space-y-6">
              {/* Amazon URL Input */}
              <div>
                <label
                  htmlFor="amazonUrl"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Amazon Product URL
                </label>
                <input
                  type="url"
                  id="amazonUrl"
                  name="amazonUrl"
                  defaultValue={currentAmazonUrl}
                  placeholder="https://www.amazon.com/dp/B09ABCDEF"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Paste the Amazon product page URL. Format should be:
                  https://www.amazon.com/dp/ASIN
                </p>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Preview with Partner ID
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    This is how the URL will look when a partner with Amazon Associates
                    ID &quot;{samplePartnerId}&quot; gets a recommendation:
                  </p>
                  <code className="block text-xs bg-white p-2 rounded border border-gray-300 overflow-x-auto">
                    {previewUrl}
                  </code>
                  <p className="mt-2 text-xs text-gray-600">
                    The <code className="bg-gray-200 px-1 rounded">?tag={samplePartnerId}</code>{' '}
                    parameter tracks affiliate commissions for the partner.
                  </p>
                </div>
              )}

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  How to find the Amazon URL
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Search for &quot;{paddle.name}&quot; on Amazon.com</li>
                  <li>Click on the matching product</li>
                  <li>
                    Copy the URL from your browser (or find the ASIN in product details)
                  </li>
                  <li>
                    Simplify to format: https://www.amazon.com/dp/ASIN (remove extra
                    parameters)
                  </li>
                </ol>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Amazon Link
                </button>
                <Link
                  href="/admin/paddles"
                  className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
