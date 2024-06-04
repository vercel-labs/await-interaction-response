'use client';

import { useEffect } from 'react';
import { onINP } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    onINP(
      (metric) => {
        console.log('ON_INP', metric);
      },
      { reportAllChanges: true },
    );
  }, []);
  return null;
}
