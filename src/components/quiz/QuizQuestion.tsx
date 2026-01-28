'use client';

interface QuizQuestionOption {
  value: string;
  label: string;
  description?: string;
}

interface QuizQuestionProps {
  question: {
    questionText: string;
    questionType: 'single' | 'multi';
    options: QuizQuestionOption[];
  };
  value: string | string[];
  onChange: (value: string | string[]) => void;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export function QuizQuestion({
  question,
  value,
  onChange,
  theme = { primaryColor: '#2563eb', secondaryColor: '#ffffff' },
}: QuizQuestionProps) {
  const handleSingleChoice = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleMultiChoice = (selectedValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(selectedValue)
      ? currentValues.filter((v) => v !== selectedValue)
      : [...currentValues, selectedValue];
    onChange(newValues);
  };

  const isSelected = (optionValue: string) => {
    if (question.questionType === 'single') {
      return value === optionValue;
    }
    return Array.isArray(value) && value.includes(optionValue);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{question.questionText}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              question.questionType === 'single'
                ? handleSingleChoice(option.value)
                : handleMultiChoice(option.value)
            }
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              isSelected(option.value)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            style={{
              borderColor: isSelected(option.value) ? theme.primaryColor : undefined,
              backgroundColor: isSelected(option.value)
                ? `${theme.primaryColor}10`
                : undefined,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded ${
                  question.questionType === 'single' ? 'rounded-full' : 'rounded'
                } border-2 flex items-center justify-center ${
                  isSelected(option.value)
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                }`}
                style={{
                  borderColor: isSelected(option.value) ? theme.primaryColor : undefined,
                  backgroundColor: isSelected(option.value) ? theme.primaryColor : undefined,
                }}
              >
                {isSelected(option.value) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
