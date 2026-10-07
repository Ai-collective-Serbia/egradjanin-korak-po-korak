import { describe, expect, it } from 'vitest';
import { groupPosition, isHelpNode, outgoing, parseGraph, validateGraph } from './graph';

const VALID = `
start: have-id-card
nodes:
  have-id-card:
    type: question
    title: Да ли имате личну карту?
    group: Припрема
    answers:
      - { label: Да, next: register }
      - { label: Не, next: get-id-card }
      - { label: Нисам сигуран, next: get-id-card }
  get-id-card:
    type: step
    title: Како до личне карте
    group: Припрема
    next: register
  register:
    type: step
    title: Регистрација
    group: Регистрација
    external: { label: Отворите еУправу, url: https://euprava.gov.rs/ }
    answers:
      - { label: Урадио сам, next: card }
      - { label: Нисам успео, next: help }
  card:
    type: card
    title: Покажите на шалтеру
    group: Пошта
    next: done
  help:
    type: end
    title: Потражите помоћ
  done:
    type: end
    title: Готово
`;

const bodies = new Set(['get-id-card', 'register', 'card']);

describe('parseGraph', () => {
  it('parses a valid graph', () => {
    const g = parseGraph(VALID);
    expect(g.start).toBe('have-id-card');
    expect(Object.keys(g.nodes)).toHaveLength(6);
  });

  it('rejects a bad node id', () => {
    expect(() => parseGraph(VALID.replace('get-id-card:', 'Get_Id:'))).toThrow();
  });

  it('rejects a question with one answer', () => {
    const one = VALID.replace(
      /      - \{ label: Не, next: get-id-card \}\n      - \{ label: Нисам сигуран, next: get-id-card \}\n/,
      '',
    );
    expect(() => parseGraph(one)).toThrow();
  });

  it('rejects a step with both next and answers', () => {
    const both = VALID.replace(
      '    next: register\n  register:',
      '    next: register\n    answers: [{ label: x, next: register }]\n  register:',
    );
    expect(() => parseGraph(both)).toThrow();
  });

  it('rejects a step with neither next nor answers', () => {
    expect(() => parseGraph(VALID.replace('    next: register\n', ''))).toThrow();
  });

  it('rejects an end node with an edge', () => {
    expect(() =>
      parseGraph(VALID.replace('    title: Готово\n', '    title: Готово\n    next: help\n')),
    ).toThrow();
  });
});

describe('validateGraph', () => {
  it('accepts the sample, including a question without a body', () => {
    expect(validateGraph(parseGraph(VALID), bodies)).toEqual([]);
  });

  it('reports a dangling edge', () => {
    const g = parseGraph(VALID.replace('next: done', 'next: nowhere'));
    expect(validateGraph(g, bodies)).toEqual([
      expect.stringContaining('"card" points to missing node "nowhere"'),
      expect.stringContaining('"done" is unreachable'),
    ]);
  });

  it('reports an unreachable node', () => {
    const extra = VALID + '  orphan:\n    type: end\n    title: Сироче\n';
    expect(validateGraph(parseGraph(extra), bodies)).toEqual([
      expect.stringContaining('"orphan" is unreachable'),
    ]);
  });

  it('reports a step or card without a body', () => {
    const errors = validateGraph(parseGraph(VALID), new Set(['register']));
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('content/nodes/get-id-card/index.md');
    expect(errors[1]).toContain('content/nodes/card/index.md');
  });

  it('reports a body folder with no node', () => {
    const errors = validateGraph(parseGraph(VALID), new Set([...bodies, 'stray']));
    expect(errors).toEqual([expect.stringContaining('content/nodes/stray/index.md has no node')]);
  });

  it('reports a start that is not a node', () => {
    const g = parseGraph(VALID.replace('start: have-id-card', 'start: missing'));
    expect(validateGraph(g, bodies)[0]).toContain('start "missing" is not a node');
  });
});

describe('outgoing', () => {
  it('returns answers, a single next as an unlabeled edge, and nothing for end', () => {
    const g = parseGraph(VALID);
    expect(outgoing(g.nodes['have-id-card'])).toHaveLength(3);
    expect(outgoing(g.nodes['get-id-card'])).toEqual([{ next: 'register' }]);
    expect(outgoing(g.nodes['card'])).toEqual([{ next: 'done' }]);
    expect(outgoing(g.nodes['done'])).toEqual([]);
  });
});

describe('isHelpNode', () => {
  it('is true only for ids that start with "help-"', () => {
    expect(isHelpNode('help-account')).toBe(true);
    expect(isHelpNode('help-upload')).toBe(true);
    expect(isHelpNode('help')).toBe(false);
    expect(isHelpNode('helper-screen')).toBe(false);
    expect(isHelpNode('done')).toBe(false);
  });
});

describe('groupPosition', () => {
  it('numbers groups by first appearance', () => {
    const g = parseGraph(VALID);
    expect(groupPosition(g, 'get-id-card')).toEqual({ name: 'Припрема', index: 1, total: 3 });
    expect(groupPosition(g, 'card')).toEqual({ name: 'Пошта', index: 3, total: 3 });
    expect(groupPosition(g, 'done')).toBeNull();
  });
});
