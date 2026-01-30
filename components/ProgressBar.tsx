'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start progress
    setIsVisible(true);
    setProgress(30);

    const timer = setTimeout(() => {
      setProgress(70);
    }, 100);

    const finishTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [pathname, searchParams]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-300 ease-out shadow-[0_0_10px_var(--accent)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
