const PREFIX = "fluentpro-ai";

function buildKey(key: string) {
  return `${PREFIX}:${key}`;
}

export function setStorageItem<T>(
  key: string,
  value: T
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    localStorage.setItem(
      buildKey(key),
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      "LocalStorage set error:",
      error
    );
  }
}

export function getStorageItem<T>(
  key: string,
  fallbackValue: T
): T {
  try {
    if (
      typeof window === "undefined"
    ) {
      return fallbackValue;
    }

    const item =
      localStorage.getItem(
        buildKey(key)
      );

    if (!item) {
      return fallbackValue;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(
      "LocalStorage get error:",
      error
    );

    return fallbackValue;
  }
}

export function removeStorageItem(
  key: string
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    localStorage.removeItem(
      buildKey(key)
    );
  } catch (error) {
    console.error(
      "LocalStorage remove error:",
      error
    );
  }
}

export function clearStorage() {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const keys = Object.keys(
      localStorage
    );

    keys.forEach((key) => {
      if (
        key.startsWith(
          `${PREFIX}:`
        )
      ) {
        localStorage.removeItem(
          key
        );
      }
    });
  } catch (error) {
    console.error(
      "LocalStorage clear error:",
      error
    );
  }
}

export function hasStorageItem(
  key: string
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return false;
    }

    return Boolean(
      localStorage.getItem(
        buildKey(key)
      )
    );
  } catch (error) {
    console.error(
      "LocalStorage check error:",
      error
    );

    return false;
  }
}

export function appendToStorageArray<T>(
  key: string,
  value: T
) {
  try {
    const existing =
      getStorageItem<T[]>(
        key,
        []
      );

    existing.push(value);

    setStorageItem(
      key,
      existing
    );
  } catch (error) {
    console.error(
      "LocalStorage append error:",
      error
    );
  }
}
