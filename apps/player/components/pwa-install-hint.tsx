"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "cm-pwa-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function PwaInstallHint() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    setHidden(false);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (hidden || isStandalone()) {
    return null;
  }

  async function handleInstall() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    setHidden(true);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  }

  return (
    <div className="mb-6 cm-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Install on your phone</p>
        <p className="mt-1 text-sm text-cm-text-muted">
          Add CrapMedia to your home screen for quick access in the car.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {promptEvent ? (
          <button
            type="button"
            onClick={handleInstall}
            className="cm-btn cm-btn-primary px-4 py-2 text-sm"
          >
            Install
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleDismiss}
          className="cm-btn cm-btn-outline px-4 py-2 text-sm"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
