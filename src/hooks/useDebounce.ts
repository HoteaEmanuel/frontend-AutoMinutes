import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, time: number, effect: () => void) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
      effect();
    }, time);
    return () => clearTimeout(id);
  }, [value, time]);
  return debouncedValue;
};
