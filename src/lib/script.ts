export type Script = 'cyr' | 'lat';

export function scriptLang(script: Script): 'sr-Cyrl' | 'sr-Latn' {
  return script === 'lat' ? 'sr-Latn' : 'sr-Cyrl';
}

export function otherScript(script: Script): Script {
  return script === 'lat' ? 'cyr' : 'lat';
}

export function collectionFor(script: Script): 'nodesCyr' | 'nodesLat' {
  return script === 'lat' ? 'nodesLat' : 'nodesCyr';
}
