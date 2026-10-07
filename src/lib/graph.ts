import { parse } from 'yaml';
import { z } from 'zod';

const nodeId = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'node ids are lowercase English words joined by hyphens');

const answerSchema = z.object({ label: z.string().min(1), next: nodeId }).strict();
const externalSchema = z.object({ label: z.string().min(1), url: z.string().url() }).strict();

const common = { title: z.string().min(1), group: z.string().min(1).optional() };

const questionSchema = z
  .object({ type: z.literal('question'), ...common, answers: z.array(answerSchema).min(2) })
  .strict();

const stepSchema = z
  .object({
    type: z.literal('step'),
    ...common,
    external: externalSchema.optional(),
    next: nodeId.optional(),
    answers: z.array(answerSchema).min(1).optional(),
  })
  .strict()
  .refine((n) => (n.next !== undefined) !== (n.answers !== undefined), {
    message: 'a step has either "next" or "answers", not both and not neither',
  });

const cardSchema = z.object({ type: z.literal('card'), ...common, next: nodeId }).strict();
const endSchema = z.object({ type: z.literal('end'), ...common }).strict();

export const nodeSchema = z.discriminatedUnion('type', [
  questionSchema,
  stepSchema,
  cardSchema,
  endSchema,
]);

export const graphSchema = z
  .object({ start: nodeId, nodes: z.record(nodeId, nodeSchema) })
  .strict();

export type Graph = z.infer<typeof graphSchema>;
export type GraphNode = z.infer<typeof nodeSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type Edge = { label?: string; next: string };

export function parseGraph(yamlText: string): Graph {
  return graphSchema.parse(parse(yamlText));
}

export function outgoing(node: GraphNode): Edge[] {
  switch (node.type) {
    case 'question':
      return node.answers;
    case 'step':
      return node.answers ?? [{ next: node.next as string }];
    case 'card':
      return [{ next: node.next }];
    case 'end':
      return [];
  }
}

export function validateGraph(graph: Graph, bodyIds: Set<string>): string[] {
  const errors: string[] = [];
  if (!graph.nodes[graph.start]) errors.push(`start "${graph.start}" is not a node`);

  for (const [id, node] of Object.entries(graph.nodes)) {
    for (const edge of outgoing(node)) {
      if (!graph.nodes[edge.next])
        errors.push(`node "${id}" points to missing node "${edge.next}"`);
    }
    const needsBody = node.type === 'step' || node.type === 'card';
    if (needsBody && !bodyIds.has(id)) {
      errors.push(`node "${id}" (${node.type}) needs content/nodes/${id}/index.md`);
    }
  }
  for (const id of bodyIds) {
    if (!graph.nodes[id]) errors.push(`content/nodes/${id}/index.md has no node in graph.yaml`);
  }

  const seen = new Set<string>();
  const stack = graph.nodes[graph.start] ? [graph.start] : [];
  while (stack.length) {
    const id = stack.pop() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const edge of outgoing(graph.nodes[id])) {
      if (graph.nodes[edge.next]) stack.push(edge.next);
    }
  }
  for (const id of Object.keys(graph.nodes)) {
    if (!seen.has(id)) errors.push(`node "${id}" is unreachable from start`);
  }
  return errors;
}

export function groupOrder(graph: Graph): string[] {
  const order: string[] = [];
  for (const node of Object.values(graph.nodes)) {
    if (node.group && !order.includes(node.group)) order.push(node.group);
  }
  return order;
}

export function groupPosition(
  graph: Graph,
  id: string,
): { name: string; index: number; total: number } | null {
  const node = graph.nodes[id];
  if (!node?.group) return null;
  const order = groupOrder(graph);
  return { name: node.group, index: order.indexOf(node.group) + 1, total: order.length };
}
