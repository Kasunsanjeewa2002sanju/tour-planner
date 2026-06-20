import { useState, useEffect } from 'react';

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Returns a copy of `items` that re-shuffles on an interval. */
export function useShuffledList(items, intervalMs = 60000) {
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    if (!items?.length) {
      setShuffled([]);
      return undefined;
    }

    setShuffled(shuffleArray(items));

    const timer = setInterval(() => {
      setShuffled(shuffleArray(items));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items, intervalMs]);

  return shuffled;
}
