// No import from ../lib/paths: a module shared with progress-client would become a separate
// chunk, which stops Astro from inlining either script. data-base always ends with a slash.
const base = document.body.dataset.base ?? '/';
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    /* offline support is best effort */
  });
}
