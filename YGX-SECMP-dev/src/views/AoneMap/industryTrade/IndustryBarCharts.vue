<template>
  <div class="it-bars">
    <div>
      <div class="it-bars__lbl">按粉尘种类分布</div>
      <div ref="dustRef" class="it-bars__chart it-bars__chart--sm" />
    </div>
    <div>
      <div class="it-bars__lbl">按涉粉作业人数分布</div>
      <div ref="workerRef" class="it-bars__chart it-bars__chart--sm" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';
import { DUST_TYPE_DATA, WORKER_COUNT_DATA } from './mockData';

const dustRef = ref<HTMLElement | null>(null);
const workerRef = ref<HTMLElement | null>(null);
let dustChart: echarts.ECharts | null = null;
let workerChart: echarts.ECharts | null = null;

function initDust() {
  if (!dustRef.value) return;
  dustChart = echarts.init(dustRef.value);
  dustChart.setOption({
    grid: { left: 4, right: 8, top: 4, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 11 },
    },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: DUST_TYPE_DATA.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: DUST_TYPE_DATA.map((d, i) => ({
          value: d.value,
          itemStyle: { color: i === 0 ? '#00e5ff' : '#0088ff', borderRadius: [0, 4, 4, 0] },
        })),
      },
    ],
  });
}

function initWorker() {
  if (!workerRef.value) return;
  workerChart = echarts.init(workerRef.value);
  workerChart.setOption({
    grid: { left: 4, right: 8, top: 8, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: WORKER_COUNT_DATA.map((d) => d.name),
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed' } },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: WORKER_COUNT_DATA.map((d) => d.value),
        itemStyle: { color: '#facc15', borderRadius: [4, 4, 0, 0] },
      },
    ],
  });
}

function resize() {
  dustChart?.resize();
  workerChart?.resize();
}

onMounted(() => {
  nextTick(() => {
    initDust();
    initWorker();
    resize();
  });
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  dustChart?.dispose();
  workerChart?.dispose();
  dustChart = null;
  workerChart = null;
});
</script>

<style lang="less" scoped>
.it-bars {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.it-bars__lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
}

.it-bars__chart {
  width: 100%;

  &--sm {
    height: 128px;
  }
}
</style>
