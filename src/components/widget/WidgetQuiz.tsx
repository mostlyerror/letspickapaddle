'use client';

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizNavigation } from '@/components/quiz/QuizNavigation';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useWidgetTheme } from './WidgetThemeProvider';

interface WidgetQuizProps {
  partnerId?: string;
  curatedPaddleIds?: string[];
  onComplete?: (sessionId: string) => void;
}

export function WidgetQuiz({ partnerId, curatedPaddleIds, onComplete }: WidgetQuizProps) {
  const theme = useWidgetTheme();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [sessionId] = useState(() => nanoid());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
    trackEvent('quiz_start');
  }, []);

  async function fetchQuestions() {
    try {
      const res = await fetch('/api/quiz/questions');
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      setQuestions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }

  async function trackEvent(eventType: string, eventData?: any) {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          sessionId,
          eventType,
          eventData,
        }),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }

  function handleAnswerChange(value: string | string[]) {
    const currentQuestion = questions[currentQuestionIndex];
    const newResponses = {
      ...responses,
      [currentQuestion.questionKey]: value,
    };
    setResponses(newResponses);
    trackEvent('question_answer', {
      questionKey: currentQuestion.questionKey,
      value,
    });
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  }

  function handleBack() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  async function handleComplete() {
    try {
      await fetch('/api/quiz/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          partnerId,
          responses,
        }),
      });
      trackEvent('quiz_complete');
      if (onComplete) {
        onComplete(sessionId);
      }
    } catch (err) {
      setError('Failed to submit responses');
    }
  }

  if (loading) {
    return (
      <QuizContainer theme={theme}>
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      </QuizContainer>
    );
  }

  if (error) {
    return (
      <QuizContainer theme={theme}>
        <ErrorMessage message={error} />
      </QuizContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <QuizContainer theme={theme}>
        <ErrorMessage message="No questions available" />
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = responses[currentQuestion.questionKey];
  const canGoNext = currentAnswer !== undefined && currentAnswer !== null && (
    !Array.isArray(currentAnswer) || currentAnswer.length > 0
  );

  return (
    <QuizContainer theme={theme}>
      <div className="space-y-6">
        <QuizProgress
          currentStep={currentQuestionIndex + 1}
          totalSteps={questions.length}
          theme={theme}
        />
        <QuizQuestion
          question={{
            questionText: currentQuestion.questionText,
            questionType: currentQuestion.questionType,
            options: JSON.parse(currentQuestion.options),
          }}
          value={currentAnswer || (currentQuestion.questionType === 'multi' ? [] : '')}
          onChange={handleAnswerChange}
          theme={theme}
        />
        <QuizNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoBack={currentQuestionIndex > 0}
          canGoNext={canGoNext}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          theme={theme}
        />
      </div>
    </QuizContainer>
  );
}
