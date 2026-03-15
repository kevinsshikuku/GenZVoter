"use client";

import { useEffect } from "react";

export default function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Capture the controller that was active when the component mounted.
    // If null, there was no previous SW — this is a first install, not an update.
    // We only reload when transitioning from an existing controller to a new one.
    const initialController = navigator.serviceWorker.controller;
    let refreshing = false;

    const reload = () => {
      if (!initialController) return; // first install — skip reload
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", reload);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", reload);
    };
  }, []);

  return null;
}
