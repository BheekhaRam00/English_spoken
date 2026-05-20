type SoundType =
  | "click"
  | "success"
  | "start-listening"
  | "stop-listening";

const soundPaths: Record<
  SoundType,
  string
> = {
  click: "/sounds/click.mp3",

  success:
    "/sounds/success.mp3",

  "start-listening":
    "/sounds/start-listening.mp3",

  "stop-listening":
    "/sounds/stop-listening.mp3"
};

let currentAudio:
  | HTMLAudioElement
  | null = null;

export function playSound(
  sound: SoundType,
  volume = 1
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const audio =
      new Audio(soundPaths[sound]);

    audio.volume = volume;

    audio.preload = "auto";

    currentAudio = audio;

    audio.play().catch((error) => {
      console.error(
        "Audio playback failed:",
        error
      );
    });
  } catch (error) {
    console.error(
      "Sound error:",
      error
    );
  }
}

export function stopSound() {
  if (!currentAudio) {
    return;
  }

  currentAudio.pause();

  currentAudio.currentTime = 0;
}

export function preloadSounds() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  Object.values(soundPaths).forEach(
    (path) => {
      const audio =
        new Audio(path);

      audio.preload = "auto";
    }
  );
}

export function playClickSound() {
  playSound("click", 0.6);
}

export function playSuccessSound() {
  playSound("success", 0.8);
}

export function playStartListeningSound() {
  playSound(
    "start-listening",
    0.8
  );
}

export function playStopListeningSound() {
  playSound(
    "stop-listening",
    0.8
  );
}
