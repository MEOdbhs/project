<template>
  <div ref="chartRef" class="hc-bar" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: { name: string; value: number; color: string }[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function setOpt() {
  if (!chart) return;
  chart.setOption({
    grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.name),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: props.data.map((d) => ({
          value: d.value,
          itemStyle: { color: d.color, borderRadius: [4, 4, 0, 0] },
        })),
        barMaxWidth: 36,
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
.hc-bar {
  width: 100%;
  height: 200px;
}
</style>
