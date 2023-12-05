import { ChannelLayout, ColorMode, FrequencyScale, WeightingFilter } from 'audiomotion-analyzer';

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

export const CHANNEL_LAYOUT_MAP: ReadonlyMap<ChannelLayout, string> = new Map([
  ['single', 'Single'],
  ['dual-combined', 'Dual Combined'],
  ['dual-horizontal', 'Dual Horizontal'],
  ['dual-vertical', 'Dual Vertical'],
]);

export const FFT_SIZES = [512, 1024, 2048, 4096, 8192, 16384, 32768] as const;
export type FFTSize = (typeof FFT_SIZES)[number];

export const MIN_FREQUENCIES = [10, 16, 20, 30, 40, 60, 100, 500, 1000] as const;
export type MinFrequency = (typeof MIN_FREQUENCIES)[number];

export const MAX_FREQUENCIES = [8000, 10000, 12000, 16000, 20000, 22000, 24000] as const;
export type MaxFrequency = (typeof MAX_FREQUENCIES)[number];

export const FREQUENCY_SCALES = ['bark', 'linear', 'log', 'mel'] as const;

export const WEIGHTING_FILTER_MAP: ReadonlyMap<WeightingFilter, string> = new Map([
  ['', 'None'],
  ['A', 'A'],
  ['B', 'B'],
  ['C', 'C'],
  ['D', 'D'],
  ['468', 'ITU-R 468'],
]);

export const COLOR_MODE_MAP: ReadonlyMap<ColorMode, string> = new Map([
  ['gradient', 'Gradient'],
  ['bar-index', 'Bar Index'],
  ['bar-level', 'Bar Level'],
]);

export const BUILT_IN_GRADIENT_MAP: ReadonlyMap<string, string> = new Map([
  ['classic', 'Classic'],
  ['orangered', 'Orangered'],
  ['prism', 'Prism'],
  ['rainbow', 'Rainbow'],
  ['steelblue', 'Steelblue'],
]);

export type Mirror = -1 | 0 | 1;
export const MIRROR_MAP: ReadonlyMap<Mirror, string> = new Map([
  [-1, 'Left'],
  [0, 'None'],
  [1, 'Right'],
]);

export const SCALE_X_LABELS = ['None', 'Frequencies', 'Musical Notes'] as const;
export type ScaleXLabel = (typeof SCALE_X_LABELS)[number];

export type VisualizerConfig = {
  mode: VisualizationModes;
  channelLayout: ChannelLayout;
  fftSize: FFTSize;
  smoothing: number;
  minFreq: MinFrequency;
  maxFreq: MaxFrequency;
  frequencyScale: FrequencyScale;
  weightingFilter: WeightingFilter;
  minDecibels: number;
  maxDecibels: number;

  linearAmplitude: boolean;
  linearBoost: number;

  colorMode: ColorMode;
  gradientLeft: string;
  gradientRight: string;
  // When set to true and channelLayout is dual-vertical, the gradient will be split between channels.
  // This option has no effect on vertical gradients, except on radial spectrum
  splitGradient: boolean;

  barSpace: number;
  alphaBars: boolean;
  ansiBands: boolean;
  // modes 1-8 only.
  ledBars: boolean;
  // This option is only effective for frequency bands modes, when ledBars is true and colorMode is set to ‘gradient’.
  trueLeds: boolean;

  // This has no effect when ledBars or lumiBars are set to true.
  roundBars: boolean;
  // This is only effective for frequency bands modes
  // lumiBars takes precedence over alphaBars and outlineBars, except on radial spectrum.
  lumiBars: boolean;
  // When true and mode is set to one of the bands modes, analyzer bars are rendered outlined, with customizable fillAlpha and lineWidth
  outlineBars: boolean;

  lineWidth: number;
  fillAlpha: number;
  // mode !== 0. In radial view, ledBars and lumiBars effects are disabled.
  radial: boolean;
  spinSpeed: number;
  // This has no effect when lumiBars is true.
  reflexRatio: number;
  // when reflexRatio > 0
  reflexAlpha: number;
  // when reflexRatio > 0
  reflexBright: number;
  // when reflexRatio > 0 && reflexRatio !== .5
  reflexFit: boolean;
  mirror: Mirror;
  showPeaks: boolean;
  // When true and mode is 10 (Graph) and showPeaks is true, peaks are connected into a continuous line. It has no effect in other modes.
  peakLine: boolean;
  showScaleX: boolean;
  noteLabels: boolean;
  // This option has no effect when radial or lumiBars are set to true.
  showScaleY: boolean;
};

export const getDefaultConfig = (): VisualizerConfig => ({
  mode: 0,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 20,
  maxFreq: 22000,
  frequencyScale: 'log',
  weightingFilter: '',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: false,
  linearBoost: 1,
  colorMode: 'gradient',
  gradientLeft: 'classic',
  gradientRight: 'classic',
  splitGradient: false,
  barSpace: 0.1,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: false,
  lumiBars: false,
  outlineBars: false,
  lineWidth: 0,
  fillAlpha: 1,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0,
  reflexAlpha: 0.15,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: true,
  peakLine: false,
  showScaleX: true,
  noteLabels: false,
  showScaleY: false,
});
