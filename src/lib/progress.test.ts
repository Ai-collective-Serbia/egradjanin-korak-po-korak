import { describe, expect, it } from 'vitest';
import {
  clearProgress,
  loadProgress,
  previousNode,
  recordAnswer,
  recordVisit,
  safeStorage,
  saveProgress,
  STORAGE_KEY,
  type StorageLike,
} from './progress';

function fakeStorage(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

describe('load/save/clear', () => {
  it('round-trips progress', () => {
    const s = fakeStorage();
    const p = recordVisit(null, 'welcome', 'cyr', 1000);
    saveProgress(s, p);
    expect(loadProgress(s)).toEqual(p);
    clearProgress(s);
    expect(loadProgress(s)).toBeNull();
  });

  it('returns null for missing, corrupted, or foreign values', () => {
    const s = fakeStorage();
    expect(loadProgress(s)).toBeNull();
    s.setItem(STORAGE_KEY, '{not json');
    expect(loadProgress(s)).toBeNull();
    s.setItem(STORAGE_KEY, JSON.stringify({ v: 2, current: 'x' }));
    expect(loadProgress(s)).toBeNull();
    s.setItem(STORAGE_KEY, JSON.stringify({ v: 1, current: 'x', script: 'xx', path: [] }));
    expect(loadProgress(s)).toBeNull();
  });
});

describe('recordVisit', () => {
  it('appends new nodes and sets current', () => {
    const p1 = recordVisit(null, 'welcome', 'cyr', 1);
    const p2 = recordVisit(p1, 'have-id-card', 'cyr', 2);
    expect(p2.current).toBe('have-id-card');
    expect(p2.path.map((v) => v.node)).toEqual(['welcome', 'have-id-card']);
    expect(p2.updatedAt).toBe(2);
  });

  it('truncates the path when revisiting an earlier node', () => {
    let p = recordVisit(null, 'a', 'cyr', 1);
    p = recordVisit(p, 'b', 'cyr', 2);
    p = recordVisit(p, 'c', 'cyr', 3);
    p = recordVisit(p, 'a', 'cyr', 4);
    expect(p.path.map((v) => v.node)).toEqual(['a']);
    expect(p.current).toBe('a');
  });

  it('switches the stored script to the page being read', () => {
    const p = recordVisit(recordVisit(null, 'a', 'cyr', 1), 'b', 'lat', 2);
    expect(p.script).toBe('lat');
  });
});

describe('recordAnswer and previousNode', () => {
  it('stores the answer on the last visit', () => {
    const p = recordAnswer(recordVisit(null, 'a', 'cyr', 1), 'Да');
    expect(p.path[0]).toEqual({ node: 'a', answer: 'Да' });
  });

  it('returns the node before current, or null at the start', () => {
    const p1 = recordVisit(null, 'a', 'cyr', 1);
    expect(previousNode(p1)).toBeNull();
    expect(previousNode(recordVisit(p1, 'b', 'cyr', 2))).toBe('a');
  });
});

describe('safeStorage', () => {
  it('uses window.localStorage when it works', () => {
    const real = fakeStorage();
    expect(safeStorage({ localStorage: real })).toBe(real);
  });

  it('falls back to memory when localStorage throws or is missing', () => {
    const throwing = {
      get localStorage(): StorageLike {
        throw new Error('blocked');
      },
    };
    const mem = safeStorage(throwing);
    mem.setItem('k', 'v');
    expect(mem.getItem('k')).toBe('v');
    expect(safeStorage({}).getItem('k')).toBeNull();
  });
});
