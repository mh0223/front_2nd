import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  const myRef = useMemo(() => {
    return { current: initValue };
  }, []);

  return myRef;
}
