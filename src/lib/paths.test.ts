import { expect, it } from 'vitest';
import { homePath, nodePath, withBase } from './paths';

it('builds script-aware paths', () => {
  expect(nodePath('cyr', 'have-id-card')).toBe('step/have-id-card/');
  expect(nodePath('lat', 'have-id-card')).toBe('lat/step/have-id-card/');
  expect(homePath('cyr')).toBe('');
  expect(homePath('lat')).toBe('lat/');
});

it('joins base with or without trailing slash', () => {
  expect(withBase('/repo/', 'step/x/')).toBe('/repo/step/x/');
  expect(withBase('/repo', 'step/x/')).toBe('/repo/step/x/');
  expect(withBase('/', '')).toBe('/');
});
