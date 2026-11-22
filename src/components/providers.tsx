'use client';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'react-hot-toast';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <>
        {children}
        <Toaster position="top-right" />
      </>
    </ThemeProvider>
  );
}
