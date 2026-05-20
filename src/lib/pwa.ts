"use client";

type BeforeInstallPromptEvent =
  Event & {
    prompt: () => Promise<void>;

    userChoice: Promise<{
      outcome:
        | "accepted"
        | "dismissed";

      platform: string;
    }>;
  };

let deferredPrompt:
  | BeforeInstallPromptEvent
  | null = null;

export function registerServiceWorker() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  window.addEventListener(
    "load",
    async () => {
      try {
        await navigator.serviceWorker.register(
          "/sw.js"
        );

        console.log(
          "Service worker registered."
        );
      } catch (error) {
        console.error(
          "Service worker registration failed:",
          error
        );
      }
    }
  );
}

export function initializePWAInstallPrompt() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      event.preventDefault();

      deferredPrompt =
        event as BeforeInstallPromptEvent;
    }
  );
}

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    return false;
  }

  try {
    await deferredPrompt.prompt();

    const choiceResult =
      await deferredPrompt.userChoice;

    deferredPrompt = null;

    return (
      choiceResult.outcome ===
      "accepted"
    );
  } catch (error) {
    console.error(
      "PWA install prompt failed:",
      error
    );

    return false;
  }
}

export function isPWAInstalled() {
  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    (
      window.navigator as Navigator & {
        standalone?: boolean;
      }
    ).standalone === true
  );
}

export function isRunningStandalone() {
  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  return window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
}

export function listenForPWAInstall(
  callback: () => void
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.addEventListener(
    "appinstalled",
    () => {
      callback();
    }
  );
}

export async function unregisterServiceWorkers() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  const registrations =
    await navigator.serviceWorker.getRegistrations();

  for (const registration of registrations) {
    await registration.unregister();
  }
}

export async function clearPWACache() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (!("caches" in window)) {
    return;
  }

  const cacheKeys =
    await caches.keys();

  await Promise.all(
    cacheKeys.map((key) =>
      caches.delete(key)
    )
  );
}

export function checkOnlineStatus() {
  if (
    typeof navigator ===
    "undefined"
  ) {
    return true;
  }

  return navigator.onLine;
}

export function listenNetworkChanges(
  onOnline: () => void,
  onOffline: () => void
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.addEventListener(
    "online",
    onOnline
  );

  window.addEventListener(
    "offline",
    onOffline
  );
}

export function removeNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.removeEventListener(
    "online",
    onOnline
  );

  window.removeEventListener(
    "offline",
    onOffline
  );
    }
