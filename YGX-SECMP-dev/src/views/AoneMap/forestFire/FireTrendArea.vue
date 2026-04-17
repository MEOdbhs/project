<template>
  <div ref="chartRef" class="ff-trend" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{ data: { time: string; count: number }[] }>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function buildOption() {
  return {
    grid: { left: 8, right: 8, top: 8, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.time),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLabel: { color: '#64748b', fontSize: 10 },
    },
    series: [
      {
        type: 'line',
        data: props.data.map((d) => d.count),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#ef4444', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(239, 68, 68, 0.35)' },
            { offset: 1, color: 'rgba(239, 68, 68, 0)' },
          ]),
        },
      },
    ],
  };
}

function init() {
  if (!chartRef.value) return;
  if (!chart) chart = echarts.init(chartRef.value);
  chart.setOption(buildOption());
}

function resize() {
  chart?.resize();
}

onMounted(() => {
  nextTick(() => {
    init();
    resize();
  });
  window.addEventListener('resize', resize);
});

watch(
  () => props.data,
  () => {
    chart?.setOption(buildOption());
  },
  { deep: true },
);

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose();
  chart = null;
});
</script>

<style lang="less" scoped>
.ff-trend {
  width: 100%;
  height: 180px;
}
</style>
