<template>
  <div class="ff-pie">
    <div ref="chartRef" class="ff-pie__chart" />
    <div class="ff-pie__legend">
      <div v-for="item in data" :key="item.name" class="ff-pie__row">
        <span class="ff-pie__dot" :style="{ backgroundColor: item.color }" />
        <span class="ff-pie__name">{{ item.name }}</span>
        <span class="ff-pie__val">{{ item.value }}</span>
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
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['38%', '58%'],
        center: ['50%', '50%'],
        padAngle: 4,
        label: { show: false },
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
.ff-pie {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ff-pie__chart {
  width: 50%;
  height: 120px;
  min-width: 100px;
}

.ff-pie__legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.ff-pie__row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.ff-pie__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.ff-pie__name {
  color: #94a3b8;
  flex: 1;
  min-width: 0;
}

.ff-pie__val {
  font-weight: 700;
  color: #f8fafc;
}
</style>
