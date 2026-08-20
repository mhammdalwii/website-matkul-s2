import { useEffect, useState } from "react";

/**
 * Hook untuk menunda (debounce) perubahan nilai.
 * Sangat berguna untuk fitur pencarian agar tidak membebani database / URL params.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer untuk menunda perubahan nilai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timer jika value berubah sebelum waktu delay habis
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
