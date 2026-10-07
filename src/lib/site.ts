import { listBodyIds, loadGraph, loadOverrides, loadUiStrings } from './content';

export const graph = loadGraph();
export const overrides = loadOverrides();
export const ui = loadUiStrings();
export const bodyIds = listBodyIds();
