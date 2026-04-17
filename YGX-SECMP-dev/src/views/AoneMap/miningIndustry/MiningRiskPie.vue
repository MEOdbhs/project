<template>
  <div class="mi-pie">
    <div ref="chartRef" class="mi-pie__chart" />
    <div class="mi-pie__legend">
      <div v-for="item in riskPieData" :key="item.name" class="mi-pie__row">
        <span class="mi-pie__dot" :style="{ backgroundColor: item.color }" />
        <span>{{ item.name }}</span>
        <b>{{ item.value }}</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';
import { riskPieData } from './mockData';

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption({
    color: riskPieData.map((i) => i.color),
    series: [{ type: 'pie', radius: ['50%', '68%'], label: { show: false }, data: riskPieData }],
  });
}
function onResize() { chart?.resize(); }
onMounted(() => { nextTick(initChart); window.addEventListener('resize', onResize); });
onUnmounted(() => { window.removeEventListener('resize', onResize); chart?.dispose(); });
</script>

<style scoped lang="less">
.mi-pie__chart { height: 180px; }
.mi-pie__legend { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; color: #94a3b8; }
.mi-pie__row { display: flex; align-items: center; gap: 6px; }
.mi-pie__dot { width: 8px; height: 8px; border-radius: 999px; }
.mi-pie__row b { color: #e2e8f0; margin-left: auto; }
</style>
