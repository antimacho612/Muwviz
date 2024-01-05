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

export type VisualizerOptions = {
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
  // NOTE:
  //        When set to true and channelLayout is dual-vertical, the gradient will be split between channels.
  //        This option has no effect on vertical gradients, except on radial spectrum
  splitGradient: boolean;

  barSpace: number;
  alphaBars: boolean;
  ansiBands: boolean;
  // NOTE: modes 1-8 only.
  ledBars: boolean;
  // NOTE: This option is only effective for frequency bands modes, when ledBars is true and colorMode is set to ‘gradient’.
  trueLeds: boolean;

  // NOTE: This has no effect when ledBars or lumiBars are set to true.
  roundBars: boolean;
  // NOTE:
  //        This is only effective for frequency bands modes
  //        lumiBars takes precedence over alphaBars and outlineBars, except on radial spectrum.
  lumiBars: boolean;
  // NOTE: When true and mode is set to one of the bands modes, analyzer bars are rendered outlined, with customizable fillAlpha and lineWidth
  outlineBars: boolean;

  lineWidth: number;
  fillAlpha: number;
  // NOTE: mode !== 0. In radial view, ledBars and lumiBars effects are disabled.
  radial: boolean;
  spinSpeed: number;
  // NOTE: This has no effect when lumiBars is true.
  reflexRatio: number;
  // NOTE: when reflexRatio > 0
  reflexAlpha: number;
  // NOTE: when reflexRatio > 0
  reflexBright: number;
  // NOTE: when reflexRatio > 0 && reflexRatio !== .5
  reflexFit: boolean;
  mirror: Mirror;
  showPeaks: boolean;
  // NOTE: When true and mode is 10 (Graph) and showPeaks is true, peaks are connected into a continuous line. It has no effect in other modes.
  peakLine: boolean;
  showScaleX: boolean;
  noteLabels: boolean;
  // NOTE: This option has no effect when radial or lumiBars are set to true.
  showScaleY: boolean;
};

export type VisualizerConfig = {
  isOn: boolean;
  backgroundColor: string;
} & VisualizerOptions;

export type VisualizerPresetConfig = Omit<VisualizerConfig, 'isOn'>;
export type VisualizerPreset = {
  id: string;
  name: string;
  canDelete: boolean;
  config: VisualizerPresetConfig;
};

const VISUALIZER_DEFAULT_PRESET: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
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
} as const;

const VISUALIZER_DEFAULT_PRESET1: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 5,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 30,
  maxFreq: 16000,
  frequencyScale: 'bark',
  weightingFilter: 'D',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: true,
  linearBoost: 2.5,
  colorMode: 'gradient',
  gradientLeft: 'rainbow',
  gradientRight: 'steelblue',
  splitGradient: false,
  barSpace: 0.3,
  alphaBars: false,
  ansiBands: false,
  ledBars: true,
  trueLeds: true,
  roundBars: false,
  lumiBars: false,
  outlineBars: false,
  lineWidth: 0,
  fillAlpha: 0,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0.1,
  reflexAlpha: 0.25,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: true,
  peakLine: false,
  showScaleY: false,
  showScaleX: true,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET2: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 10,
  channelLayout: 'dual-combined',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 30,
  maxFreq: 16000,
  frequencyScale: 'log',
  weightingFilter: 'D',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: true,
  linearBoost: 2,
  colorMode: 'gradient',
  gradientLeft: 'steelblue',
  gradientRight: 'orangered',
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
  fillAlpha: 0.2,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0,
  reflexAlpha: 0.15,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: true,
  peakLine: true,
  showScaleY: false,
  showScaleX: false,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET3: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 10,
  channelLayout: 'dual-vertical',
  fftSize: 8192,
  smoothing: 0.65,
  minFreq: 30,
  maxFreq: 16000,
  frequencyScale: 'log',
  weightingFilter: 'D',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: true,
  linearBoost: 1.8,
  colorMode: 'bar-index',
  gradientLeft: 'rainbow',
  gradientRight: 'rainbow',
  splitGradient: false,
  barSpace: 1,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: false,
  lumiBars: false,
  outlineBars: true,
  lineWidth: 2,
  fillAlpha: 0,
  radial: true,
  spinSpeed: 1,
  reflexRatio: 0,
  reflexAlpha: 0.15,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: false,
  peakLine: false,
  showScaleY: false,
  showScaleX: false,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET_CLASSIC_LED_BARS: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 6,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 20,
  maxFreq: 20000,
  frequencyScale: 'log',
  weightingFilter: '',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: false,
  linearBoost: 1,
  colorMode: 'gradient',
  gradientLeft: 'classic',
  gradientRight: 'steelblue',
  splitGradient: false,
  barSpace: 0.5,
  alphaBars: false,
  ansiBands: true,
  ledBars: true,
  trueLeds: true,
  roundBars: false,
  lumiBars: false,
  outlineBars: true,
  lineWidth: 0,
  fillAlpha: 1,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0,
  reflexAlpha: 1,
  reflexBright: 1,
  reflexFit: false,
  mirror: 0,
  showPeaks: true,
  peakLine: false,
  showScaleY: false,
  showScaleX: false,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET_MIRROR_WAVE: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 10,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 20,
  maxFreq: 20000,
  frequencyScale: 'log',
  weightingFilter: '',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: false,
  linearBoost: 1,
  colorMode: 'gradient',
  gradientLeft: 'rainbow',
  gradientRight: 'steelblue',
  splitGradient: false,
  barSpace: 0.5,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: false,
  lumiBars: false,
  outlineBars: false,
  lineWidth: 1.5,
  fillAlpha: 0.6,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0.5,
  reflexAlpha: 1,
  reflexBright: 1,
  reflexFit: false,
  mirror: 0,
  showPeaks: false,
  peakLine: false,
  showScaleY: false,
  showScaleX: false,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET_BARK_LINEAR: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 0,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.5,
  minFreq: 20,
  maxFreq: 20000,
  frequencyScale: 'bark',
  weightingFilter: 'D',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: true,
  linearBoost: 1.8,
  colorMode: 'gradient',
  gradientLeft: 'rainbow',
  gradientRight: 'steelblue',
  splitGradient: false,
  barSpace: 0.1,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: false,
  lumiBars: false,
  outlineBars: false,
  lineWidth: 1.5,
  fillAlpha: 0.6,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0.3,
  reflexAlpha: 0.25,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: true,
  peakLine: false,
  showScaleY: false,
  showScaleX: false,
  noteLabels: false,
} as const;

const VISUALIZER_DEFAULT_PRESET_ROUND_BARS_BAR_LEVEL: VisualizerPresetConfig = {
  backgroundColor: '#1f1f1f',
  mode: 3,
  channelLayout: 'single',
  fftSize: 8192,
  smoothing: 0.7,
  minFreq: 30,
  maxFreq: 16000,
  frequencyScale: 'log',
  weightingFilter: 'B',
  minDecibels: -85,
  maxDecibels: -25,
  linearAmplitude: true,
  linearBoost: 2,
  colorMode: 'bar-level',
  gradientLeft: 'prism',
  gradientRight: 'steelblue',
  splitGradient: false,
  barSpace: 0.25,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: true,
  lumiBars: false,
  outlineBars: true,
  lineWidth: 1.5,
  fillAlpha: 0.3,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0.5,
  reflexAlpha: 1,
  reflexBright: 1,
  reflexFit: true,
  mirror: 0,
  showPeaks: false,
  peakLine: false,
  showScaleY: false,
  showScaleX: true,
  noteLabels: false,
} as const;

export const VISUALIZER_DEFAULT_PRESETS: VisualizerPreset[] = [
  {
    id: 'c31e499c-88aa-47c7-8960-5e1bbd9db5c7',
    name: 'Default',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET,
  },
  {
    id: 'a871577f-9eab-4d99-b580-3c6a52f4c32a',
    name: 'Default1（LED Bars）',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET1,
  },
  {
    id: '03377db1-fd83-4db3-976a-fdf8dec2812f',
    name: 'Default2（Dual Lines）',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET2,
  },
  {
    id: 'eae4d8de-0ae1-4112-9bc1-dfe641ccf4c3',
    name: 'Default3（Circle Lines）',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET3,
  },
  {
    id: 'f64df8c6-8930-4c5e-b4fd-07618151dc70',
    name: 'Classic LED Bars',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET_CLASSIC_LED_BARS,
  },
  {
    id: 'e1a0ae01-de7b-44cc-afa4-7721fb68a472',
    name: 'Wave Mirror',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET_MIRROR_WAVE,
  },
  {
    id: '509be6b0-7f28-4bb6-8ebc-18cc37757f25',
    name: 'Bark Scale + Linear Amplitude',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET_BARK_LINEAR,
  },
  {
    id: '89208f71-9607-441e-b203-732b6853c527',
    name: 'Round Bars + "Bar Level" Color Mode',
    canDelete: false,
    config: VISUALIZER_DEFAULT_PRESET_ROUND_BARS_BAR_LEVEL,
  },
];

export const VISUALIZERS_DEFAULT_CONFIG: VisualizerConfig[] = [
  {
    isOn: true,
    ...VISUALIZER_DEFAULT_PRESET1,
  },
  {
    isOn: true,
    ...VISUALIZER_DEFAULT_PRESET2,
  },
  {
    isOn: true,
    ...VISUALIZER_DEFAULT_PRESET3,
  },
];
