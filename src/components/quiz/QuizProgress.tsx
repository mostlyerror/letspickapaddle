'use client';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  theme?: {
    primaryColor?: string;
  };
}

export function QuizProgress({
  currentStep,
  totalSteps,
  theme = { primaryColor: '#2563eb' },
}: QuizProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: theme.primaryColor,
          }}
        />
      </div>
    </div>
  );
}
