"use client";

/**
 * useCentresSearch
 *
 * Fuzzy full-text search across all IEBC registration centres.
 *
 * Features:
 *  - County/constituency as first-class dimensions — typing "kakamega"
 *    returns ALL centres in Kakamega County
 *  - Typo-tolerant — 1-char edit distance for words ≥ 4 chars,
 *    2-char edit distance for words ≥ 6 chars
 *  - Prefix match — "nair" finds "Nairobi"
 *  - Whitespace-forgiving — "  kakamega  " works fine
 *  - Multi-word AND logic — every query word must match somewhere
 *  - Ranked: name > landmark > address > ward > constituency > county
 */

import { useState, useEffect } from "react";
import type { RegistrationCentre } from "@/lib/types";
// Static import — avoids dynamic-import failure with no error feedback.
// CentresTab is already code-split at the tab level so this is fine.
import CENTRES_STATIC, {
  CENTRES_DATA_VERSION as DATA_VERSION,
  CENTRES_LAST_UPDATED as LAST_UPDATED,
} from "@/lib/centres-data";

/* ── Normalisation ──────────────────────────────────────────────── */
function norm(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")          // collapse whitespace
    .replace(/[''`]/g, "'")        // normalise apostrophes
    .replace(/[-–—]/g, " ");       // treat hyphens as spaces
}

/* ── Edit distance (Levenshtein) ───────────────────────────────── */
function editDistance(a: string, b: string): number {
  // Early exit — length diff alone rules out small distances
  if (Math.abs(a.length - b.length) > 3) return 99;
  const m = a.length, n = b.length;
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[n];
}

/* ── How well does one query word match one token word? ─────────── */
function wordScore(tokenWord: string, queryWord: string): number {
  const tl = tokenWord.length;
  const ql = queryWord.length;

  // Exact match
  if (tokenWord === queryWord) return 1.0;

  // Substring — query is fully inside the token word  (e.g. "nair" in "nairobi")
  if (tokenWord.includes(queryWord) && ql >= 2) {
    // reward longer query matches more
    return 0.85 * (ql / tl);
  }

  // Prefix — token starts with query  (e.g. "kakameg" → "kakamega")
  if (tokenWord.startsWith(queryWord) && ql >= 3) {
    return 0.80 * (ql / tl);
  }

  // Fuzzy — edit distance (only for long-enough words to avoid false positives)
  if (ql >= 4 && tl >= 4) {
    const dist = editDistance(tokenWord, queryWord);
    if (dist === 1) return 0.70;
    if (dist === 2 && ql >= 6 && tl >= 6) return 0.50;
  }

  return 0;
}

/* ── Best score for one query word across all words in a token ── */
function tokenScore(tokenText: string, queryWord: string): number {
  // First: whole-token contains the query word as substring
  if (tokenText.includes(queryWord)) return 1.0;

  // Then: word-by-word comparison inside the token
  const tWords = tokenText.split(" ");
  let best = 0;
  for (const tw of tWords) {
    const s = wordScore(tw, queryWord);
    if (s > best) best = s;
  }
  return best;
}

/* ── Build the searchable index for one centre ─────────────────── */
interface IndexEntry {
  centre: RegistrationCentre;
  /** pre-normalised (text, weight) pairs */
  fields: { text: string; weight: number }[];
}

function buildEntry(c: RegistrationCentre): IndexEntry {
  const fields: { text: string; weight: number }[] = [
    { text: norm(c.name),            weight: 6   },
    ...(c.landmark
      ? [{ text: norm(c.landmark),   weight: 5   }]
      : []),
    ...(c.nearbyLandmarks ?? []).map((l) => ({ text: norm(l), weight: 4.5 })),
    { text: norm(c.address),          weight: 4   },
    ...(c.ward
      ? [{ text: norm(c.ward),        weight: 3.5 }]
      : []),
    // constituency + county get a direct boost so county-level queries
    // surface ALL centres in that county at a decent score
    { text: norm(c.constituency),     weight: 3   },
    { text: norm(c.county),           weight: 2.5 },
    ...(c.notes
      ? [{ text: norm(c.notes),       weight: 0.5 }]
      : []),
  ];
  return { centre: c, fields };
}

/* ── Score one centre against the full query ────────────────────── */
function scoreEntry(entry: IndexEntry, queryWords: string[]): number {
  let total = 0;
  for (const qw of queryWords) {
    let wordBest = 0;
    for (const field of entry.fields) {
      const s = tokenScore(field.text, qw);
      if (s === 0) continue;
      const weighted = field.weight * s;
      if (weighted > wordBest) wordBest = weighted;
    }
    // Every query word must match at least weakly (AND logic)
    // A score below 0.3 means the word genuinely didn't match — bail out
    if (wordBest < 0.3) return 0;
    total += wordBest;
  }
  return total;
}

/* ── Hook ───────────────────────────────────────────────────────── */
export interface UseCentresSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: RegistrationCentre[];
  loading: boolean;
  totalCentres: number;
  dataVersion: string;
  lastUpdated: string;
}

// Build the search index once at module level — runs synchronously, zero async risk
const SEARCH_INDEX: IndexEntry[] = CENTRES_STATIC.map(buildEntry);

export function useCentresSearch(): UseCentresSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RegistrationCentre[]>([]);

  /** Re-run search whenever query changes */
  useEffect(() => {
    const q = norm(query);
    if (!q) { setResults([]); return; }

    const words = q.split(" ").filter((w) => w.length > 0);
    const scored = SEARCH_INDEX
      .map((entry) => ({ centre: entry.centre, score: scoreEntry(entry, words) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    setResults(scored.map((r) => r.centre));
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading: false,
    totalCentres: CENTRES_STATIC.length,
    dataVersion: DATA_VERSION,
    lastUpdated: LAST_UPDATED,
  };
}
