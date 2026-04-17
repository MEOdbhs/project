<template>
  <div class="hc-pie">
    <div ref="chartRef" class="hc-pie__chart" />
    <div class="hc-pie__legend">
      <div v-for="item in data" :key="item.name" class="hc-pie__row">
        <span class="hc-pie__dot" :style="{ backgroundColor: item.color }" />
        <span class="hc-pie__name">{{ item.name }}</span>
        <span class="hc-pie__pct">{{ percentOf(item) }}%</span>
        <span class="hc-pie__val">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: { name: string; value: number; color: string }[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const totalVal = computed(() => props.data.reduce((s, d) => s + d.value, 0));

function percentOf(item: { value: number }) {
  if (!totalVal.value) return 0;
  return Math.round((item.value / totalVal.value) * 1000) / 10;
}

function setOpt() {
  if (!chart) return;
  chart.setOption({
    color: props.data.map((d) => d.color),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '68%'],
        center: ['50%', '46%'],
        padAngle: 2,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 10,
          color: '#cbd5e1',
          lineHeight: 14,
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8,
          lineStyle: { color: 'rgba(148, 163, 184, 0.45)' },
        },
        emphasis: {
          label: { fontSize: 11, fontWeight: 'bold' },
        },
        data: props.data.map((d) => ({ name: d.name, value: d.value })),
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
.hc-pie {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hc-pie__chart {
  width: 100%;
  height: 200px;
}

.hc-pie__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  justify-content: center;
}

.hc-pie__row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.hc-pie__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.hc-pie__name {
  color: #94a3b8;
  flex: 1;
  min-width: 0;
}

.hc-pie__pct {
  font-size: 10px;
  font-weight: 700;
  color: #67e8f9;
  font-family: ui-monospace, monospace;
}

.hc-pie__val {
  font-weight: 600;
  color: #e2e8f0;
  font-variant-numeric: tabular-nums;
}
</style>
