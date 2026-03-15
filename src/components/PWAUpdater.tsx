"use client";

import { useEffect } from "react";

export default function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const reload = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", reload);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", reload);
    };
  }, []);

  return null;
}
