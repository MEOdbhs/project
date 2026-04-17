<template>
  <div class="pie-wrap">
    <div ref="chartRef" class="pie-chart" />
    <div class="pie-legend">
      <div v-for="item in data" :key="item.name" class="pie-legend__row">
        <span class="pie-legend__dot" :style="{ backgroundColor: item.color }" />
        <span class="pie-legend__name">{{ item.name }}</span>
        <span class="pie-legend__val">{{ item.value }}</span>
        <span class="pie-legend__pct">({{ pct(item) }}%)</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';

const data = [
  { name: '滑坡', value: 456, color: '#3b82f6' },
  { name: '泥石流', value: 238, color: '#eab308' },
  { name: '崩塌', value: 125, color: '#ef4444' },
  { name: '地面塌陷', value: 68, color: '#22c55e' },
  { name: '地裂缝', value: 42, color: '#a855f7' },
];

const total = computed(() => data.reduce((s, i) => s + i.value, 0));

function pct(item: (typeof data)[0]) {
  return ((item.value / total.value) * 100).toFixed(1);
}

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function init() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption({
    color: data.map((d) => d.color),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20, 20, 30, 0.92)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      formatter: '{b}: {c}处 ({d}%)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '50%'],
        padAngle: 2,
        label: { show: false },
        data: data.map((d) => ({ name: d.name, value: d.value })),
      },
    ],
  });
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
.pie-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 200px;
}

.pie-chart {
  width: 50%;
  height: 100%;
  min-width: 140px;
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.pie-legend__row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.pie-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.pie-legend__name {
  color: #94a3b8;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pie-legend__val {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #e2e8f0;
}

.pie-legend__pct {
  color: #64748b;
}
</style>
