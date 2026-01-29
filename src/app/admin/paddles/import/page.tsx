'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';

interface PreviewData {
  [paddleName: string]: string;
}

interface ImportResult {
  paddle: string;
  status: 'success' | 'error';
  message?: string;
}

interface ImportResponse {
  success: boolean;
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
  results?: ImportResult[];
  error?: string;
}

export default function ImportPage() {
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

      // Validate format
      if (typeof data !== 'object' || Array.isArray(data)) {
        setStatus('❌ Invalid JSON format. Expected an object with paddle names as keys.');
        return;
      }

      setPreview(data);
      setStatus('✓ File loaded successfully. Review changes below.');
    } catch (error) {
      setStatus(`❌ Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function applyImport() {
    if (!preview) return;

    setIsLoading(true);
    setStatus('Importing...');
    setResults(null);

    try {
      const response = await fetch('/api/admin/import-affiliate-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: preview }),
      });

      const result: ImportResponse = await response.json();

      if (response.ok && result.success) {
        setStatus(
          `✓ Import completed! ${result.summary?.successful} successful, ${result.summary?.failed} failed.`
        );
        setResults(result.results || []);
      } else {
        setStatus(`❌ Import failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }

  const previewEntries = preview ? Object.entries(preview) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/paddles"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Paddles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bulk Import Amazon Links
          </h1>
          <p className="text-gray-600">
            Upload a JSON file to update multiple paddle affiliate URLs at once
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
                  'Selkirk Vanguard Power Air Invikta':
                    'https://www.amazon.com/dp/B09ABC123',
                  'JOOLA Ben Johns Hyperion CFS 16':
                    'https://www.amazon.com/dp/B08XYZ456',
                  'Engage Pursuit Pro MX 6.0': 'https://www.amazon.com/dp/B0CDEF789',
                },
                null,
                2
              )}
            </pre>
            <p className="mt-2 text-xs text-gray-600">
              Use exact paddle names as keys, Amazon URLs as values
            </p>
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
              2. Preview Changes ({previewEntries.length} paddles)
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paddle Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amazon URL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewEntries.map(([name, url]) => (
                    <tr key={name}>
                      <td className="px-4 py-3 text-sm text-gray-900">{name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs truncate max-w-md">
                        {url}
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
                        {result.status === 'success' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Success
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

            <div className="mt-6">
              <Link
                href="/admin/paddles"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Paddles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
