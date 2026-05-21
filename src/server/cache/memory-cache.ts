type CacheValue<T> = {
  value: T;

  expiresAt: number;
};

const memoryCache =
  new Map<
    string,
    CacheValue<unknown>
  >();

export function setCache<T>({
  key,
  value,
  ttl = 1000 * 60 * 5
}: {
  key: string;

  value: T;

  ttl?: number;
}) {
  memoryCache.set(key, {
    value,

    expiresAt:
      Date.now() + ttl
  });
}

export function getCache<T>(
  key: string
): T | null {
  const cached =
    memoryCache.get(key);

  if (!cached) {
    return null;
  }

  const isExpired =
    Date.now() >
    cached.expiresAt;

  if (isExpired) {
    memoryCache.delete(
      key
    );

    return null;
  }

  return cached.value as T;
}

export function deleteCache(
  key: string
) {
  memoryCache.delete(
    key
  );
}

export function clearCache() {
  memoryCache.clear();
}

export function hasCache(
  key: string
) {
  const cached =
    memoryCache.get(key);

  if (!cached) {
    return false;
  }

  const isExpired =
    Date.now() >
    cached.expiresAt;

  if (isExpired) {
    memoryCache.delete(
      key
    );

    return false;
  }

  return true;
}

export function getCacheStats() {
  return {
    totalKeys:
      memoryCache.size
  };
}
