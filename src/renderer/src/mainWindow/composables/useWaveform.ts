import { onMounted, watch } from 'vue';
import * as d3 from 'd3';
import WaveformData from 'waveform-data';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useSettingsStore } from '@mainWindow/stores/settings';
import { storeToRefs } from 'pinia';
import { Song } from '@shared/types';

export const useWaveform = (pathElementSelector: string) => {
  const { currentSong } = useAudioPlayer();
  const { cacheWaveformData } = storeToRefs(useSettingsStore());

  let pathEl;

  let audioContext: AudioContext;
  const getWaveformData = async (song: Song) => {
    if (!audioContext) audioContext = new AudioContext();

    const response = await fetch(`media://${song.filePath}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    let data: DataView | undefined;
    WaveformData.createFromAudio(
      {
        audio_context: audioContext,
        audio_buffer: audioBuffer,
        split_channels: false,
        disable_worker: true,
      },
      (error, waveformData) => {
        if (error) {
          console.error(error);
          return;
        }

        const channel = waveformData.channel(0);
        const headerSize = 4;
        const totalSize = headerSize + waveformData.length * 2;
        const buffer = new ArrayBuffer(totalSize);
        data = new DataView(buffer);

        // Length
        data.setInt32(0, waveformData.length, true);

        // Sample min/max values
        let offset = headerSize;
        channel.min_array().forEach((minValue) => data && data.setInt8(offset++, minValue));
        channel.max_array().forEach((maxValue) => data && data.setInt8(offset++, maxValue));
      }
    );

    return data;
  };

  const saveWaveformData = async (songId: string, waveformData: DataView) => {
    try {
      await window.electron.invoke.saveWaveformData(songId, waveformData);
    } catch (e) {
      console.error('Failed to save waveform data', e);
    }
  };

  const drawDefault = () => {
    pathEl.attr('d', 'M 2 2 A 1 1 0 0 1 2 -2 L 1022 -2 A 1 1 0 0 1 1022 2 L 2 2');
  };

  const drawWaveform = async (waveformData: DataView) => {
    const length = waveformData.getUint32(0, true);
    const minValues = Array<number>();
    const maxValues = Array<number>();

    for (let i = 0; i < length; i++) {
      minValues.push(waveformData.getInt8(4 + i));
      maxValues.push(waveformData.getInt8(4 + length + i));
    }

    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain([0, length]).rangeRound([0, 1024]);
    y.domain([d3.min(minValues), d3.max(maxValues)]).rangeRound([12, -12]);
    const area = d3
      .area()
      .x((_, i) => x(i))
      .y0((_, i) => y(minValues[i]))
      .y1((d) => y(d));

    pathEl.datum(maxValues).attr('d', area);
  };

  const drawPath = async () => {
    drawDefault();
    if (!currentSong.value) return;

    // キャッシュから波形データを検索・取得
    let waveformData = await window.electron.invoke.getWaveformData(currentSong.value.id);

    // キャッシュデータがない場合は波形データ生成
    if (!waveformData) {
      waveformData = await getWaveformData(currentSong.value);
      // 波形データをキャッシュ（設定の「波形データキャッシュ」が有効の場合のみ）
      if (waveformData && cacheWaveformData.value)
        await saveWaveformData(currentSong.value.id, waveformData);
    }

    if (waveformData) drawWaveform(waveformData);
  };

  onMounted(async () => {
    pathEl = d3.select(pathElementSelector);
    await drawPath();
  });

  watch(currentSong, async () => await drawPath());
};
