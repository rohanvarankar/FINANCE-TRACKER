"use client";

import { useEffect, useRef, useState } from "react";

/*
  BEHAVIOUR
  ─────────
  • Appears at the very top of the screen, above the navbar.
  • Shows 2s after load on EVERY visit until the app is actually installed.
  • "Later" / "✕" → sessionStorage dismiss (re-appears next visit).
  • Once installed (appinstalled event or standalone mode) → gone forever.
  • onVisibilityChange(bool) callback → page.js uses it to push navbar down.
  • Fully responsive: stacked on mobile, single row on tablet/desktop.
*/

export default function InstallPrompt({ onVisibilityChange }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow]         = useState(false);
  const [installing, setInstalling] = useState(false);
  const timerRef = useRef(null);

  // Notify parent whenever visibility changes
  useEffect(() => {
    onVisibilityChange?.(show);
  }, [show, onVisibilityChange]);

  useEffect(() => {
    // Already running as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // Already seen this session
    if (sessionStorage.getItem("pwa-prompt-seen")) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => {
      setShow(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    timerRef.current = setTimeout(() => setShow(true), 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setShow(false);
          return;
        }
      } catch (err) {
        console.error("[PWA]", err);
      } finally {
        setDeferredPrompt(null);
        setInstalling(false);
      }
    } else {
      alert(
        "How to install TrackFin:\n\n" +
        "📱 iPhone/iPad  →  Safari Share (□↑)  →  'Add to Home Screen'\n" +
        "🤖 Android      →  Chrome ⋮ menu       →  'Add to Home Screen'\n" +
        "💻 Desktop      →  Click ⊕ in Chrome address bar"
      );
    }
    dismiss();
  };

  const dismiss = () => {
    sessionStorage.setItem("pwa-prompt-seen", "true");
    setShow(false);
  };

  if (!show) return null;

return (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md">
    
    <div className="bg-[#050d1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-3">

      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-white">
          ₹
        </div>

        <div>
          <p className="text-white text-sm font-semibold">
            Install TrackFin
          </p>
          <p className="text-slate-400 text-xs">
            Faster • Offline • App Experience
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          disabled={installing}
          className="px-4 py-2 bg-teal-500 text-white text-xs rounded-lg font-semibold hover:bg-teal-400 transition"
        >
          {installing ? "..." : "Install"}
        </button>

        <button
          onClick={dismiss}
          className="text-slate-400 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>

    </div>
  </div>
)};  