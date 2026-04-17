<template>
  <div ref="chartRef" class="mi-trend" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';
import { trendData } from './mockData';

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption({
    grid: { left: 8, right: 8, top: 20, bottom: 4, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 0, textStyle: { color: '#94a3b8', fontSize: 10 } },
    xAxis: { type: 'category', data: trendData.map((d) => d.name), axisLabel: { color: '#64748b', fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: '风险',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: trendData.map((d) => d.risks),
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59,130,246,.14)' },
      },
      {
        name: '隐患',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: trendData.map((d) => d.hazards),
        itemStyle: { color: '#f97316' },
        areaStyle: { color: 'rgba(249,115,22,.14)' },
      },
      {
        name: '致灾因素',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: trendData.map((d) => d.factors),
        itemStyle: { color: '#ef4444' },
        areaStyle: { color: 'rgba(239,68,68,.14)' },
      },
    ],
  });
}

function onResize() {
  chart?.resize();
}

onMounted(() => {
  nextTick(initChart);
  window.addEventListener('resize', onResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  chart?.dispose();
});
</script>

<style scoped lang="less">
.mi-trend { width: 100%; height: 156px; }
</style>
