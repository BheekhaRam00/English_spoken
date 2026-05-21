type RateLimitEntry = {
  count: number;

  expiresAt: number;
};

const rateLimitStore =
  new Map<
    string,
    RateLimitEntry
  >();

const WINDOW_DURATION =
  1000 * 60;

const MAX_REQUESTS =
  60;

function getClientIdentifier(
  request:
    | Request
    | {
        headers: Headers;
      }
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  return (
    forwardedFor ||
    realIp ||
    "anonymous"
  );
}

export function applyRateLimit(
  request:
    | Request
    | {
        headers: Headers;
      }
) {
  const identifier =
    getClientIdentifier(
      request
    );

  const now =
    Date.now();

  const existingEntry =
    rateLimitStore.get(
      identifier
    );

  if (!existingEntry) {
    rateLimitStore.set(
      identifier,
      {
        count: 1,

        expiresAt:
          now +
          WINDOW_DURATION
      }
    );

    return true;
  }

  const isExpired =
    now >
    existingEntry.expiresAt;

  if (isExpired) {
    rateLimitStore.set(
      identifier,
      {
        count: 1,

        expiresAt:
          now +
          WINDOW_DURATION
      }
    );

    return true;
  }

  if (
    existingEntry.count >=
    MAX_REQUESTS
  ) {
    return false;
  }

  existingEntry.count += 1;

  rateLimitStore.set(
    identifier,
    existingEntry
  );

  return true;
}

export function clearRateLimitStore() {
  rateLimitStore.clear();
}

export function getRateLimitStats() {
  return {
    totalClients:
      rateLimitStore.size,

    maxRequests:
      MAX_REQUESTS,

    windowDuration:
      WINDOW_DURATION
  };
}
