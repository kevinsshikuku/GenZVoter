"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useVerifiedCount(): { count: number | null; loading: boolean } {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "counters", "verified-users"),
      (snap) => {
        setCount(snap.exists() ? snap.data().count ?? 0 : 0);
        setLoading(false);
      },
      (error) => {
        console.error("Counter listener error:", error);
        setCount(0);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { count, loading };
}
