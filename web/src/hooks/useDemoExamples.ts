import { useEffect, useState } from 'react';

import { getDemoExamples, type DemoExample } from '../api/demo';

export function useDemoExamples(): DemoExample[] {
  const [examples, setExamples] = useState<DemoExample[]>([]);

  useEffect(() => {
    let active = true;
    void getDemoExamples()
      .then((result) => {
        if (active) setExamples(result);
      })
      .catch(() => {
        if (active) setExamples([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return examples;
}
