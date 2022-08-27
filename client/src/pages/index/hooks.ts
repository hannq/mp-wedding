import { useState, useCallback } from 'react';

export function useScrollIntoView() {
  const [id, setId] = useState('');
  const setScrollIntoViewId = useCallback(async (nextId: string) => {
    setId('');
    await new Promise(r => setTimeout(r, 500));
    setId(nextId);
  }, []);

  return {
    scrollIntoViewId: id,
    setScrollIntoViewId
  }
}
