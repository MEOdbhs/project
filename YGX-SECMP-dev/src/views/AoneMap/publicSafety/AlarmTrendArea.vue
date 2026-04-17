<template>
  <div ref="chartRef" class="ps-trend" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{ data: { time: string; value: number }[] }>();
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function setOpt() {
  if (!chart) return;
  chart.setOption({
    grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.time),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
    },
    tooltip: { trigger: 'axis' },
    series: [{
      type: 'line',
      smooth: true,
      data: props.data.map((d) => d.value),
      symbolSize: 4,
      lineStyle: { color: '#38bdf8', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(56,189,248,0.35)' },
          { offset: 1, color: 'rgba(56,189,248,0)' },
        ]),
      },
    }],
  });
}

function onResize() { chart?.resize(); }
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
.ps-trend { width: 100%; height: 220px; }
</style>
