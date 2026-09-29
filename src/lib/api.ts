import { useEffect, useState } from "react";

/**
 * The original site talks to its own Node/Express backend under `/api`.
 * In dev, vite.config.ts proxies `/api` to https://example.com so the data loads.
 * Set VITE_API_BASE to point somewhere else (e.g. your own backend).
 */
const BASE = import.meta.env.VITE_API_BASE ?? "";
const API = `${BASE}/api`;

export function apiUrl(path: string) {
  return `${BASE}${path}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path} (${res.status})`);
  return res.json();
}

// Simple module-level cache + in-flight dedupe.
const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function load<T>(path: string): Promise<T> {
  let p = inflight.get(path) as Promise<T> | undefined;
  if (!p) {
    p = fetchJson<T>(path)
      .then((data) => {
        cache.set(path, data);
        return data;
      })
      .finally(() => inflight.delete(path));
    inflight.set(path, p);
  }
  return p;
}

type State<T> = { path: string; data?: T; error?: Error } | null;

export function useApi<T>(path: string, { enabled = true }: { enabled?: boolean } = {}) {
  const [state, setState] = useState<State<T>>(null);

  useEffect(() => {
    if (!enabled || cache.has(path)) return;
    let cancelled = false;
    load<T>(path).then(
      (data) => !cancelled && setState({ path, data }),
      (err) => !cancelled && setState({ path, error: err instanceof Error ? err : new Error(String(err)) }),
    );
    return () => {
      cancelled = true;
    };
  }, [path, enabled]);

  const current = state?.path === path ? state : null;
  const data = (cache.has(path) ? (cache.get(path) as T) : current?.data) ?? null;
  const error = current?.error ?? null;
  return { data, loading: enabled && data === null && !error, error };
}

// ---- Medialog endpoints ----

export type Animanga = {
  name: string;
  type: "Anime" | "Manga" | "Manwha" | string;
  img: string;
  date?: string;
  progress?: number | null;
  progressTotal?: number | null;
  score?: number;
};

const EMPTY: Animanga[] = [];

export function useAnimanga({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, loading, error } = useApi<Animanga[]>("/medialog/animanga/all", { enabled });
  return { data: Array.isArray(data) ? data : EMPTY, loading, error };
}

export type MedialogStats = {
  animangaTypes: { name: string; value: number }[];
  animangaSummary: {
    animeAvgScore: number;
    mangaAvgScore: number;
    totalEpisodes: number;
    totalChapters: number;
    watching: number;
    reading: number;
    animeCompleted: number;
    mangaCompleted: number;
  };
  topAnimangaByScore: {
    title: string;
    imageUrl: string;
    mediaType: "anime" | "manga";
    score: number;
    progress: number | null;
    progressTotal: number | null;
  }[];
  animangaFinishedPerYear: { year: string; count: number }[];
};

export function useMedialogStats() {
  const { data, loading, error } = useApi<MedialogStats>("/medialog/stats");
  return { stats: data, loading, error };
}
