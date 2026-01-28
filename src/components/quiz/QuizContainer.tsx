'use client';

import { ReactNode } from 'react';

interface QuizContainerProps {
  children: ReactNode;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export function QuizContainer({ children, theme }: QuizContainerProps) {
  return (
    <div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      style={{
        backgroundColor: theme?.secondaryColor,
      }}
    >
      {children}
    </div>
  );
}
