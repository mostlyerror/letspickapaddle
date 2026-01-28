'use client';

import { createContext, useContext, ReactNode } from 'react';

interface WidgetTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

const defaultTheme: WidgetTheme = {
  primaryColor: '#2563eb',
  secondaryColor: '#ffffff',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  borderRadius: '0.5rem',
};

const WidgetThemeContext = createContext<WidgetTheme>(defaultTheme);

export function useWidgetTheme() {
  return useContext(WidgetThemeContext);
}

export function WidgetThemeProvider({
  theme,
  children,
}: {
  theme?: Partial<WidgetTheme>;
  children: ReactNode;
}) {
  const mergedTheme = { ...defaultTheme, ...theme };

  return (
    <WidgetThemeContext.Provider value={mergedTheme}>
      <div style={{ fontFamily: mergedTheme.fontFamily }}>{children}</div>
    </WidgetThemeContext.Provider>
  );
}
