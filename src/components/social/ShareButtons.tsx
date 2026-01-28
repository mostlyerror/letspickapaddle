'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ShareButtonsProps {
  sessionId: string;
  partnerId?: string;
  theme?: {
    primaryColor?: string;
  };
}

export function ShareButtons({ sessionId, partnerId, theme }: ShareButtonsProps) {
  const [sharing, setSharing] = useState(false);

  const shareUrl = `${window.location.origin}/results?session=${sessionId}${
    partnerId ? `&ref=${partnerId}` : ''
  }`;
  const cardUrl = `${window.location.origin}/api/social/card?sessionId=${sessionId}`;

  async function handleShare(platform: string) {
    setSharing(true);

    try {
      // Track share attempt
      await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          partnerId,
          platform,
          shareUrl,
          resultCardUrl: cardUrl,
        }),
      });

      // Open share dialog based on platform
      if (platform === 'twitter') {
        const text = encodeURIComponent('I found my perfect pickleball paddle! Find yours:');
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      } else if (platform === 'facebook') {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      } else if (platform === 'linkedin') {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      } else if (platform === 'download') {
        // Download the result card image
        const link = document.createElement('a');
        link.href = cardUrl;
        link.download = 'paddlefit-results.png';
        link.click();
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Share Your Results</h3>
      <p className="text-gray-600 mb-4">
        Help others find their perfect paddle too!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button
          onClick={() => handleShare('twitter')}
          disabled={sharing}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
          Twitter
        </Button>
        <Button
          onClick={() => handleShare('facebook')}
          disabled={sharing}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
          Facebook
        </Button>
        <Button
          onClick={() => handleShare('linkedin')}
          disabled={sharing}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </Button>
        <Button
          onClick={() => handleShare('download')}
          disabled={sharing}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </Button>
        <Button
          onClick={() => handleShare('copy')}
          disabled={sharing}
          variant="outline"
          className="flex items-center justify-center gap-2 col-span-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </Button>
      </div>
    </div>
  );
}
