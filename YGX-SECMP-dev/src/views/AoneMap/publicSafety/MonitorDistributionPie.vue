<template>
  <div class="ps-pie">
    <div ref="chartRef" class="ps-pie__chart" />
    <div class="ps-pie__legend">
      <div v-for="item in data" :key="item.name" class="ps-pie__row">
        <span class="ps-pie__dot" :style="{ backgroundColor: item.color }" />
        <span class="ps-pie__name">{{ item.name }}</span>
        <span class="ps-pie__val">{{ item.value }}</span>
      </div>
    </div>
  </div>
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
    color: props.data.map((d) => d.color),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,23,42,0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
    },
    series: [{ type: 'pie', radius: ['50%', '70%'], label: { show: false }, data: props.data }],
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
.ps-pie__chart { width: 100%; height: 190px; }
.ps-pie__legend { display: grid; grid-template-columns: 1fr; gap: 6px; }
.ps-pie__row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.ps-pie__dot { width: 8px; height: 8px; border-radius: 999px; }
.ps-pie__name { color: #94a3b8; flex: 1; }
.ps-pie__val { color: #e2e8f0; font-weight: 600; }
</style>
