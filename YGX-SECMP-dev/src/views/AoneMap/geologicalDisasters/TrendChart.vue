<template>
  <div ref="chartRef" class="trend-chart" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const chartData = [
  { month: '1月', 滑坡: 12, 泥石流: 8, 崩塌: 4 },
  { month: '2月', 滑坡: 8, 泥石流: 5, 崩塌: 3 },
  { month: '3月', 滑坡: 15, 泥石流: 10, 崩塌: 6 },
  { month: '4月', 滑坡: 25, 泥石流: 18, 崩塌: 8 },
  { month: '5月', 滑坡: 35, 泥石流: 28, 崩塌: 12 },
  { month: '6月', 滑坡: 48, 泥石流: 38, 崩塌: 15 },
  { month: '7月', 滑坡: 58, 泥石流: 45, 崩塌: 18 },
  { month: '8月', 滑坡: 52, 泥石流: 40, 崩塌: 16 },
  { month: '9月', 滑坡: 38, 泥石流: 28, 崩塌: 10 },
  { month: '10月', 滑坡: 22, 泥石流: 15, 崩塌: 6 },
  { month: '11月', 滑坡: 15, 泥石流: 8, 崩塌: 4 },
  { month: '12月', 滑坡: 10, 泥石流: 6, 崩塌: 3 },
];

function buildOption(): echarts.EChartsOption {
  return {
    color: ['#3b82f6', '#eab308', '#ef4444'],
    grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20, 20, 30, 0.92)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
    },
    legend: { show: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map((d) => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.35)' } },
      axisLabel: { color: '#6b7280', fontSize: 10 },
    },
    series: [
      {
        name: '滑坡',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: '#3b82f6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ]),
        },
        data: chartData.map((d) => d.滑坡),
      },
      {
        name: '泥石流',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: '#eab308' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(234, 179, 8, 0.4)' },
            { offset: 1, color: 'rgba(234, 179, 8, 0)' },
          ]),
        },
        data: chartData.map((d) => d.泥石流),
      },
      {
        name: '崩塌',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: '#ef4444' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(239, 68, 68, 0.4)' },
            { offset: 1, color: 'rgba(239, 68, 68, 0)' },
          ]),
        },
        data: chartData.map((d) => d.崩塌),
      },
    ],
  };
}

function init() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
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

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose();
  chart = null;
});
</script>

<style lang="less" scoped>
.trend-chart {
  width: 100%;
  height: 176px;
}
</style>
