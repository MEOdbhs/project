<template>
  <div ref="chartRef" class="ps-bar" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{ data: { name: string; value: number; color: string }[] }>();
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function setOpt() {
  if (!chart) return;
  chart.setOption({
    grid: { left: 4, right: 18, top: 6, bottom: 6, containLabel: true },
    xAxis: {
      type: 'value',
      show: true,
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 9 },
    },
    yAxis: {
      type: 'category',
      data: props.data.map((i) => i.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, width: 72, overflow: 'truncate' },
      inverse: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15,23,42,0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
      formatter: (p: unknown) => {
        const arr = Array.isArray(p) ? p : [p];
        const x = arr[0] as { name?: string; value?: number; color?: string };
        const n = x?.name ?? '';
        const v = x?.value ?? 0;
        return `${n}<br/><span style="opacity:.85">累计</span> <b>${v}</b> 起`;
      },
    },
    series: [
      {
        type: 'bar',
        data: props.data.map((i) => ({
          value: i.value,
          itemStyle: { color: i.color, borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: 12,
        label: {
          show: true,
          position: 'right',
          color: '#94a3b8',
          fontSize: 10,
          formatter: '{c}',
        },
      },
    ],
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
.ps-bar { width: 100%; height: 220px; }
</style>
