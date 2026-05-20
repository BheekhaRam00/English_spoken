"use client";

import {
  useCallback,
  useEffect,
  useState
} from "react";

type UseLocalStorageReturn<T> = {
  value: T;

  setValue: (
    value: T
  ) => void;

  removeValue: () => void;

  loading: boolean;
};

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValueState] =
    useState<T>(initialValue);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      const stored =
        localStorage.getItem(key);

      if (stored !== null) {
        setValueState(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.error(
        "useLocalStorage load error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [key]);

  const setValue =
    useCallback(
      (newValue: T) => {
        try {
          setValueState(newValue);

          if (
            typeof window ===
            "undefined"
          ) {
            return;
          }

          localStorage.setItem(
            key,
            JSON.stringify(
              newValue
            )
          );
        } catch (error) {
          console.error(
            "useLocalStorage save error:",
            error
          );
        }
      },
      [key]
    );

  const removeValue =
    useCallback(() => {
      try {
        setValueState(
          initialValue
        );

        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        localStorage.removeItem(
          key
        );
      } catch (error) {
        console.error(
          "useLocalStorage remove error:",
          error
        );
      }
    }, [initialValue, key]);

  return {
    value,

    setValue,

    removeValue,

    loading
  };
}
