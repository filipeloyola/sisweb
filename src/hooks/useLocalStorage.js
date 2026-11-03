import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to synchronize React state with browser's localStorage.
 *
 * @template T
 * @param {string} key - The localStorage key to store the data under.
 * @param {T} initialValue - Default fallback value if nothing is stored in localStorage.
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]} Tuple containing state, setter, and reset/remove function.
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state with stored value or fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}" from localStorage:`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  // Setter function that supports both direct values and functional updates
  const setValue = useCallback((value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (storageError) {
          console.error(`[useLocalStorage] Error setting key "${key}" in localStorage:`, storageError);
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`[useLocalStorage] Unexpected error updating key "${key}":`, error);
    }
  }, [key]);

  // Remove helper to clean up or reset
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}" from localStorage:`, error);
    }
  }, [key, initialValue]);

  // Sync state if another tab modifies the same localStorage key
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (err) {
          console.warn(`[useLocalStorage] Storage event parse error for "${key}":`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
