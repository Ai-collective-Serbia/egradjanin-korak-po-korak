import { describe, expect, it } from 'vitest';
import { loadGraph, loadOverrides, loadUiStrings } from './content';

describe('content/ (the real wizard content)', () => {
  it('graph.yaml parses and passes every build-time rule', () => {
    expect(() => loadGraph()).not.toThrow();
  });

  it('ui-strings.yaml has every interface label', () => {
    expect(() => loadUiStrings()).not.toThrow();
  });

  it('translit-overrides.yaml is a Cyrillic to Latin word map', () => {
    expect(() => loadOverrides()).not.toThrow();
  });
});
