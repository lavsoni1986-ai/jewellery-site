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

  const installApp = () => {
    if (prompt) {
      (prompt as Event & { prompt: () => void }).prompt();
    }
  };

  if (!prompt) return null;

  return (
    <button
      onClick={installApp}
      className="fixed bottom-20 left-4 bg-[#D4AF37] text-black px-4 py-2 rounded shadow-lg hover:bg-[#B8952A] transition"
    >
      📲 Install App
    </button>
  );
}