<template>
  <div ref="chartRef" class="hc-area" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: { name: string; value: number }[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function setOpt() {
  if (!chart) return;
  chart.setOption({
    grid: { left: 8, right: 8, top: 8, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.name),
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'line',
        data: props.data.map((d) => d.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#38bdf8', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(56, 189, 248, 0.35)' },
            { offset: 1, color: 'rgba(56, 189, 248, 0)' },
          ]),
        },
      },
    ],
  });
}

onMounted(() => {
  nextTick(() => {
    if (!chartRef.value) return;
    chart = echarts.init(chartRef.value);
    setOpt();
    chart.resize();
  });
  window.addEventListener('resize', onResize);
});

function onResize() {
  chart?.resize();
}

watch(
  () => props.data,
  () => setOpt(),
  { deep: true },
);

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  chart?.dispose();
  chart = null;
});
</script>

<style lang="less" scoped>
.hc-area {
  width: 100%;
  height: 100%;
  min-height: 120px;
}
</style>
