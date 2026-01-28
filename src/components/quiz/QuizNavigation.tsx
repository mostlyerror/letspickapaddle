'use client';

import { Button } from '@/components/ui/Button';

interface QuizNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  theme?: {
    primaryColor?: string;
  };
}

export function QuizNavigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastQuestion,
  theme = { primaryColor: '#2563eb' },
}: QuizNavigationProps) {
  return (
    <div className="flex justify-between gap-4">
      {canGoBack && onBack ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        style={{
          backgroundColor: canGoNext ? theme.primaryColor : undefined,
        }}
      >
        {isLastQuestion ? 'See Results' : 'Next'}
      </Button>
    </div>
  );
}
