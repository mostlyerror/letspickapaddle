'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function PartnerSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      website: formData.get('website'),
      partnerType: formData.get('type'),
    };

    try {
      const res = await fetch('/api/partners/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      setSuccess(true);
      setApiKey(result.apiKey);
      setEmbedCode(result.embedCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to PaddleFit!</h1>
              <p className="text-gray-600 mt-2">Your account has been created successfully</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      alert('API Key copied!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Keep this key safe. You'll need it to access analytics.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embed Code
                </label>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {embedCode}
                  </pre>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      alert('Embed code copied!');
                    }}
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add this code to any page on your website where you want the quiz to appear.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Copy the embed code above</li>
                  <li>Paste it into your website HTML</li>
                  <li>Test the quiz on your site</li>
                  <li>Watch your analytics grow!</li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => router.push('/')} variant="outline">
                  Back to Home
                </Button>
                <Button onClick={() => window.open('/widget/quiz?partner=' + apiKey, '_blank')}>
                  Test Widget
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Become a Partner</h1>
            <p className="text-gray-600 mt-2">
              Add a personalized paddle quiz to your site. Keep 100% of affiliate commissions.
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name or Company
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL (Optional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Partner Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a type</option>
                <option value="blog">Blog/Content Site</option>
                <option value="influencer">Influencer/Creator</option>
                <option value="retailer">Retailer</option>
                <option value="coach">Coach/Instructor</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Free Tier Includes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Up to 100 quiz completions/month</li>
                <li>✓ Basic analytics dashboard</li>
                <li>✓ <strong>100% of affiliate commissions</strong></li>
                <li>✓ 14-day trial to test the widget</li>
              </ul>
              <p className="text-xs text-blue-700 mt-2">
                Upgrade anytime to remove branding and increase limits.
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Get My Widget'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
