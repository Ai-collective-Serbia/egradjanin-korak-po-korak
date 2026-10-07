import { nodePath, withBase } from '../lib/paths';
import {
  clearProgress,
  loadProgress,
  previousNode,
  recordAnswer,
  recordVisit,
  safeStorage,
  saveProgress,
} from '../lib/progress';
import type { Script } from '../lib/script';

const dataset = document.body.dataset as { base?: string; script?: Script; node?: string };
const base = dataset.base ?? '/';
const script: Script = dataset.script === 'lat' ? 'lat' : 'cyr';
const storage = safeStorage(window);

if (dataset.node) {
  let progress = recordVisit(loadProgress(storage), dataset.node, script, Date.now());
  saveProgress(storage, progress);

  for (const answer of document.querySelectorAll<HTMLAnchorElement>('a[data-answer]')) {
    answer.addEventListener('click', () => {
      progress = recordAnswer(progress, answer.dataset.answer ?? '');
      saveProgress(storage, progress);
    });
  }

  const back = document.querySelector<HTMLAnchorElement>('a[data-back]');
  const prev = previousNode(progress);
  if (back && prev) back.href = withBase(base, nodePath(script, prev));
} else {
  const progress = loadProgress(storage);
  const fresh = document.querySelector<HTMLElement>('[data-fresh]');
  const resume = document.querySelector<HTMLElement>('[data-resume]');
  const link = document.querySelector<HTMLAnchorElement>('a[data-resume-link]');
  const reset = document.querySelector<HTMLButtonElement>('button[data-reset]');

  if (progress && resume && link) {
    link.href = withBase(base, nodePath(progress.script, progress.current));
    resume.hidden = false;
    if (fresh) fresh.hidden = true;
  }
  reset?.addEventListener('click', () => {
    if (window.confirm(reset.dataset.confirm ?? '')) {
      clearProgress(storage);
      window.location.reload();
    }
  });
}
