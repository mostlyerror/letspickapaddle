'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

interface QuizQuestion {
  id: string;
  questionKey: string;
  questionText: string;
  questionType: 'single' | 'multi';
  displayOrder: number;
  options: QuizOption[];
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
    loadProgress();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/quiz/questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('quizProgress');
    if (saved) {
      const { responses: savedResponses, currentIndex: savedIndex } = JSON.parse(saved);
      setResponses(savedResponses);
      setCurrentIndex(savedIndex);
    }
  };

  const saveProgress = (newResponses: Record<string, any>, newIndex: number) => {
    localStorage.setItem(
      'quizProgress',
      JSON.stringify({ responses: newResponses, currentIndex: newIndex })
    );
  };

  const handleAnswer = (value: string | string[]) => {
    const currentQuestion = questions[currentIndex];
    const newResponses = {
      ...responses,
      [currentQuestion.questionKey]: value,
    };
    setResponses(newResponses);
    saveProgress(newResponses, currentIndex);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveProgress(responses, newIndex);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveProgress(responses, newIndex);
    }
  };

  const submitQuiz = async () => {
    try {
      const res = await fetch('/api/quiz/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('quizProgress');
        localStorage.setItem('sessionId', data.data.sessionId);
        router.push(`/results?sessionId=${data.data.sessionId}`);
      }
    } catch (err) {
      setError('Error submitting quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No questions available</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = responses[currentQuestion.questionKey];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.questionText}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected =
                currentQuestion.questionType === 'multi'
                  ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
                  : currentAnswer === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (currentQuestion.questionType === 'multi') {
                      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                      const newValue = current.includes(option.value)
                        ? current.filter((v) => v !== option.value)
                        : [...current, option.value];
                      handleAnswer(newValue);
                    } else {
                      handleAnswer(option.value);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="px-6 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentIndex === questions.length - 1 ? 'Get Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
