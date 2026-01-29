'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';

interface PaddleData {
  name: string;
  brand: string;
  priceCents: number;
  weightOz?: number;
  gripCircumference?: number;
  coreMaterial?: string;
  faceMaterial?: string;
  shape?: string;
  balancePointMm?: number;
  powerRating?: number;
  controlRating?: number;
  spinRating?: number;
  sweetSpotSize?: string;
  swingWeight?: number;
  twistWeight?: number;
  handleLengthIn?: number;
  usapaApproved?: boolean;
  imageUrl?: string;
  amazonUrl?: string;
}

interface PreviewData {
  paddles: PaddleData[];
}

interface ImportResult {
  paddle: string;
  status: 'success' | 'error' | 'created' | 'updated';
  message?: string;
}

interface ImportResponse {
  success: boolean;
  summary?: {
    total: number;
    created: number;
    updated: number;
    failed: number;
  };
  results?: ImportResult[];
  error?: string;
}

export default function ImportFullPaddlesPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [status, setStatus] = useState<string>('');
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('');
    setResults(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Handle both array format and object with paddles key
      const paddles = Array.isArray(data) ? data : data.paddles;

      if (!paddles || !Array.isArray(paddles)) {
        setStatus('❌ Invalid JSON format. Expected an array of paddles or { paddles: [...] }');
        return;
      }

      if (paddles.length === 0) {
        setStatus('❌ No paddles found in file');
        return;
      }

      // Validate required fields
      const missingFields = paddles.some(
        (p) => !p.name || !p.brand || !p.priceCents
      );

      if (missingFields) {
        setStatus(
          '❌ Some paddles are missing required fields (name, brand, priceCents)'
        );
        return;
      }

      setPreview({ paddles });
      setStatus(
        `✓ File loaded successfully. Found ${paddles.length} paddles. Review changes below.`
      );
    } catch (error) {
      setStatus(
        `❌ Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async function applyImport() {
    if (!preview) return;

    setIsLoading(true);
    setStatus('Importing...');
    setResults(null);

    try {
      const response = await fetch('/api/admin/import-paddles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paddles: preview.paddles }),
      });

      const result: ImportResponse = await response.json();

      if (response.ok && result.success) {
        setStatus(
          `✓ Import completed! ${result.summary?.created || 0} created, ${result.summary?.updated || 0} updated, ${result.summary?.failed || 0} failed.`
        );
        setResults(result.results || []);
      } else {
        setStatus(`❌ Import failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/paddles"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Paddles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bulk Import Paddles (Full Data)
          </h1>
          <p className="text-gray-600">
            Upload a JSON file to create or update multiple paddles with complete specifications
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            1. Upload JSON File
          </h2>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Expected Format */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Expected JSON Format
            </h3>
            <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-x-auto">
              {JSON.stringify(
                {
                  paddles: [
                    {
                      name: 'Selkirk Vanguard Power Air Invikta',
                      brand: 'Selkirk',
                      priceCents: 17995,
                      weightOz: 8.0,
                      gripCircumference: 4.25,
                      coreMaterial: 'polymer',
                      faceMaterial: 'carbon fiber',
                      shape: 'elongated',
                      balancePointMm: 260,
                      powerRating: 9,
                      controlRating: 7,
                      spinRating: 8,
                      sweetSpotSize: 'large',
                      swingWeight: 115,
                      twistWeight: 6.8,
                      handleLengthIn: 5.5,
                      usapaApproved: true,
                      amazonUrl: 'https://www.amazon.com/dp/B09L3QXKJT',
                    },
                  ],
                },
                null,
                2
              )}
            </pre>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p>
                <strong>Required fields:</strong> name, brand, priceCents
              </p>
              <p>
                <strong>Optional fields:</strong> weightOz, gripCircumference,
                coreMaterial, faceMaterial, shape, ratings, amazonUrl, etc.
              </p>
              <p>
                <strong>Note:</strong> Matching paddles (by name) will be
                updated. New paddles will be created.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 flex gap-4 text-sm">
            <a
              href="/scripts/paddle-data-template.json"
              className="text-blue-600 hover:text-blue-800"
            >
              📄 Download Template
            </a>
            <Link
              href="/admin/paddles/import"
              className="text-blue-600 hover:text-blue-800"
            >
              🔗 Import Amazon URLs Only
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              status.startsWith('✓')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : status.startsWith('❌')
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {status}
          </div>
        )}

        {/* Preview */}
        {preview && !results && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              2. Preview Changes ({preview.paddles.length} paddles)
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Specs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ratings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.paddles.map((paddle, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {paddle.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {paddle.brand}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${(paddle.priceCents / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {paddle.weightOz && `${paddle.weightOz}oz`}
                        {paddle.coreMaterial && `, ${paddle.coreMaterial}`}
                        {paddle.faceMaterial && `, ${paddle.faceMaterial}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {paddle.powerRating && `P:${paddle.powerRating}`}
                        {paddle.controlRating && ` C:${paddle.controlRating}`}
                        {paddle.spinRating && ` S:${paddle.spinRating}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={applyImport}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Importing...' : 'Apply Import'}
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setStatus('');
                }}
                disabled={isLoading}
                className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Import Results
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paddle Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {result.paddle}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {result.status === 'created' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ➕ Created
                          </span>
                        ) : result.status === 'updated' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ✏️ Updated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✗ Error
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {result.message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/admin/paddles"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Paddles
              </Link>
              <button
                onClick={() => {
                  setResults(null);
                  setPreview(null);
                  setStatus('');
                }}
                className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Import More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
