<template>
  <div class="it-pie">
    <div ref="chartRef" class="it-pie__chart" />
    <div class="it-pie__legend">
      <div v-for="(item, index) in data" :key="item.name" class="it-pie__row">
        <span class="it-pie__dot" :style="{ backgroundColor: colors[index % colors.length] }" />
        <span class="it-pie__name">{{ item.name }}</span>
        <span class="it-pie__val">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: { name: string; value: number }[];
  colors: string[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function setOpt() {
  if (!chart) return;
  chart.setOption({
    color: props.colors,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['52%', '72%'],
        center: ['50%', '50%'],
        padAngle: 3,
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
  () => [props.data, props.colors],
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
.it-pie {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.it-pie__chart {
  width: 100%;
  height: 192px;
}

.it-pie__legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.it-pie__row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.it-pie__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.it-pie__name {
  color: rgba(255, 255, 255, 0.55);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.it-pie__val {
  font-family: ui-monospace, monospace;
  color: #fff;
  font-weight: 600;
}
</style>
