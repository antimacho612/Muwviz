export type VisualizationModes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10;

export const VISUALIZATION_MODE_MAP: ReadonlyMap<VisualizationModes, string> = new Map([
  [0, 'Discrete frequencies'],
  [1, '1/24th octave / 240 bands'],
  [2, '1/12th octave / 120 bands'],
  [3, '1/8th octave / 80 bands'],
  [4, '1/6th octave / 60 bands'],
  [5, '1/4th octave / 40 bands'],
  [6, '1/3rd octave / 30 bands'],
  [7, 'Half octave / 20 bands'],
  [8, 'Full octave / 10 bands'],
  [10, 'Line / Area graph'],
]);

export type VisualizerConfig = {
  mode: VisualizationModes;
  colorMode: 'gradient' | 'bar-index' | 'bar-level';
};

export const visualizer = () => {};
