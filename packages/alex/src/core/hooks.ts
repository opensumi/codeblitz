import { useRef } from 'react';

export const useConstant = <T>(fn: () => T): T => {
  const valueRef = useRef<{ v: T }>();
  if (!valueRef.current) {
    valueRef.current = { v: fn() };
  }
  return valueRef.current.v;
};
