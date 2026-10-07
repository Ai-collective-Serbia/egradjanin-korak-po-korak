import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { loadOverrides } from './lib/content';
import { nodesLoader } from './loaders/nodes';

const overrides = loadOverrides();
const schema = z.object({});

export const collections = {
  nodesCyr: defineCollection({ loader: nodesLoader('cyr', overrides), schema }),
  nodesLat: defineCollection({ loader: nodesLoader('lat', overrides), schema }),
};
