import { useRef } from "react";

export function useMyRef<T>(initValue: T | null) {
  const currentRef = useRef(initValue);

  return currentRef;
}
