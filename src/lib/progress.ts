import type { Script } from './script';

export const STORAGE_KEY = 'egradjanin-progress';

export interface Visit {
  node: string;
  answer?: string;
}

export interface Progress {
  v: 1;
  current: string;
  script: Script;
  path: Visit[];
  updatedAt: number;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

/** window.localStorage when available and working, otherwise an in-memory stand-in. */
export function safeStorage(win: { localStorage?: StorageLike }): StorageLike {
  try {
    const s = win.localStorage;
    if (!s) return memoryStorage();
    s.setItem('__probe', '1');
    s.removeItem('__probe');
    return s;
  } catch {
    return memoryStorage();
  }
}

function isVisit(value: unknown): value is Visit {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.node === 'string' && (v.answer === undefined || typeof v.answer === 'string');
}

export function loadProgress(storage: StorageLike): Progress | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Progress>;
    const okScript = p.script === 'cyr' || p.script === 'lat';
    if (p.v !== 1 || typeof p.current !== 'string' || !Array.isArray(p.path) || !okScript) {
      return null;
    }
    const path: unknown[] = p.path;
    if (path.length === 0 || !path.every(isVisit)) return null;
    if ((path[path.length - 1] as Visit).node !== p.current) return null;
    return p as Progress;
  } catch {
    return null;
  }
}

export function saveProgress(storage: StorageLike, progress: Progress): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* storage full or blocked: progress is best effort */
  }
}

export function clearProgress(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function recordVisit(
  previous: Progress | null,
  node: string,
  script: Script,
  now: number,
): Progress {
  const path = previous ? [...previous.path] : [];
  const index = path.findIndex((v) => v.node === node);
  if (index >= 0) path.length = index + 1;
  else path.push({ node });
  return { v: 1, current: node, script, path, updatedAt: now };
}

export function recordAnswer(progress: Progress, answer: string): Progress {
  const path = [...progress.path];
  const last = path[path.length - 1];
  if (last) path[path.length - 1] = { ...last, answer };
  return { ...progress, path };
}

export function previousNode(progress: Progress): string | null {
  return progress.path.length >= 2 ? progress.path[progress.path.length - 2].node : null;
}
