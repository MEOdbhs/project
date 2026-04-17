<template>
  <div class="ps-hdth">
    <div class="ps-hdth__meta">
      <span class="ps-hdth__tag ps-hdth__tag--hd">高清</span>
      <span>高频采样</span>
      <span class="ps-hdth__sep">|</span>
      <span class="ps-hdth__tag ps-hdth__tag--th">热成像</span>
      <span>高频采样</span>
      <span class="ps-hdth__unit">单位：次/分钟</span>
    </div>
    <div ref="chartRef" class="ps-hdth__chart" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { MonitorActivitySlot } from './types';

const props = defineProps<{ data: MonitorActivitySlot[] }>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const HD = '#22d3ee';
const TH = '#fb923c';

function setOpt() {
  if (!chart) return;
  const xs = props.data.map((d) => d.slot);
  chart.setOption({
    color: [HD, TH],
    grid: { left: 6, right: 10, top: 28, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
      axisPointer: { type: 'cross', crossStyle: { color: '#475569' } },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: xs,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 9, rotate: 38, interval: 1 },
    },
    yAxis: {
      type: 'value',
      name: '频次',
      nameTextStyle: { color: '#64748b', fontSize: 10 },
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
    },
    series: [
      {
        name: '高清',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: props.data.map((d) => d.hdRate),
        lineStyle: { width: 2, color: HD },
        itemStyle: { color: HD },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34,211,238,0.22)' },
            { offset: 1, color: 'rgba(34,211,238,0)' },
          ]),
        },
      },
      {
        name: '热成像',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: props.data.map((d) => d.thermalRate),
        lineStyle: { width: 2, color: TH },
        itemStyle: { color: TH },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251,146,60,0.18)' },
            { offset: 1, color: 'rgba(251,146,60,0)' },
          ]),
        },
      },
    ],
  });
}

function onResize() {
  chart?.resize();
}

onMounted(() => {
  nextTick(() => {
    if (!chartRef.value) return;
    chart = echarts.init(chartRef.value);
    setOpt();
  });
  window.addEventListener('resize', onResize);
});

watch(() => props.data, setOpt, { deep: true });

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  chart?.dispose();
});
</script>

<style lang="less" scoped>
.ps-hdth {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

.ps-hdth__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #94a3b8;
  padding: 0 2px;
}

.ps-hdth__tag {
  font-weight: 700;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid;

  &--hd {
    color: #22d3ee;
    border-color: rgba(34, 211, 238, 0.45);
    background: rgba(34, 211, 238, 0.08);
  }

  &--th {
    color: #fb923c;
    border-color: rgba(251, 146, 60, 0.45);
    background: rgba(251, 146, 60, 0.08);
  }
}

.ps-hdth__sep {
  color: #475569;
  margin: 0 2px;
}

.ps-hdth__unit {
  margin-left: auto;
  color: #64748b;
  font-size: 9px;
}

.ps-hdth__chart {
  width: 100%;
  height: 220px;
}
</style>
