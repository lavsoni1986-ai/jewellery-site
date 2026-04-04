"use client";

import { useState, useEffect } from "react";

export default function InstallButton() {
  const [prompt, setPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const installApp = async () => {
    if (!prompt) return;

    (prompt as Event & { prompt: () => void }).prompt();

    const choiceResult = await (prompt as Event & { userChoice: Promise<{ outcome: string }> }).userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted install");
    }

    setPrompt(null);
  };

  if (!prompt) return null;

  return (
    <button
      onClick={installApp}
      className="fixed bottom-6 left-6 bg-gold text-black px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
    >
      📲 Install App
    </button>
  );
}