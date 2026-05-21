type TimeoutOptions = {
  timeout?: number;

  timeoutMessage?: string;
};

export async function withTimeout<T>(
  promise: Promise<T>,
  {
    timeout = 20000,

    timeoutMessage =
      "Request timeout exceeded."
  }: TimeoutOptions = {}
): Promise<T> {
  let timeoutId:
    | NodeJS.Timeout
    | undefined;

  const timeoutPromise =
    new Promise<never>(
      (_, reject) => {
        timeoutId =
          setTimeout(() => {
            reject(
              new Error(
                timeoutMessage
              )
            );
          }, timeout);
      }
    );

  try {
    const result =
      await Promise.race([
        promise,
        timeoutPromise
      ]);

    return result as T;
  } finally {
    if (timeoutId) {
      clearTimeout(
        timeoutId
      );
    }
  }
}

export function sleep(
  duration: number
) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        duration
      );
    }
  );
}
