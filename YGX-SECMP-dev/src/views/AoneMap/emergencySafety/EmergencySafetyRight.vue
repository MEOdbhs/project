<template>
  <aside class="es-right">
   

    <div class="es-card es-card--pie tech-border">
      <div class="es-sec-head">
        <PieChartOutlined class="es-sec-ico" />
        <h3>灾害类型分布</h3>
      </div>
      <div class="es-pie-row">
        <div ref="pieRef" class="es-pie-chart" />
        <div class="es-pie-legend">
          <div v-for="item in disasterDistribution" :key="item.name" class="es-pie-item">
            <div class="es-pie-name">
              <i class="es-pie-dot" :style="{ background: item.color }" />
              <span>{{ item.name }}</span>
            </div>
            <div class="es-pie-val">
              <b>{{ item.value }}</b>
              <span class="es-pie-pct">({{ pct(item.value) }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="es-card es-card--rank tech-border">
      <div class="es-sec-head">
        <BarChartOutlined class="es-sec-ico" />
        <h3>隐患点区域排行</h3>
      </div>
      <div class="es-rank-scroll custom-scroll">
        <div v-for="(item, idx) in areaRanking" :key="item.name" class="es-rank-item">
          <div class="es-rank-top">
            <div class="es-rank-left">
              <span class="es-rank-idx" :class="{ top3: idx < 3 }">{{ idx + 1 }}</span>
              <span class="es-rank-name">{{ item.name }}</span>
            </div>
            <span class="es-rank-num">{{ item.value }}处</span>
          </div>
          <div class="es-rank-bar">
            <div
              class="es-rank-fill"
              :style="{ width: barReady ? `${(item.value / 28) * 100}%` : '0%', background: item.color }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="es-card es-card--info tech-border">
      <div class="es-sec-head">
        <InfoCircleOutlined class="es-sec-ico" />
        <h3>预警动态</h3>
      </div>
      <div class="es-info-body">
        <div class="es-info-row">
          <span class="es-info-dot es-info-dot--r" />
          <div>
            <p class="es-info-txt">刘家峡镇黄河沿岸发布滑坡红色预警</p>
            <span class="es-info-time">09:30</span>
          </div>
        </div>
        <div class="es-info-row">
          <span class="es-info-dot es-info-dot--a" />
          <div>
            <p class="es-info-txt">盐锅峡镇库区发布滑坡橙色预警</p>
            <span class="es-info-time">09:15</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import {
  BarChartOutlined,
  BellOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { areaRanking, disasterDistribution, distributionTotal } from './mockData';

const pieRef = ref<HTMLDivElement | null>(null);
let pieChart: echarts.ECharts | null = null;
const barReady = ref(false);

function pct(v: number) {
  return ((v / distributionTotal) * 100).toFixed(1);
}

function initPie() {
  if (!pieRef.value) return;
  pieChart = echarts.init(pieRef.value);
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      textStyle: { fontSize: 10 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '68%'],
        padAngle: 3,
        label: { show: false },
        data: disasterDistribution.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
      },
    ],
  });
}

function onResize() {
  pieChart?.resize();
}

onMounted(() => {
  initPie();
  window.addEventListener('resize', onResize);
  requestAnimationFrame(() => {
    barReady.value = true;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  pieChart?.dispose();
  pieChart = null;
});
</script>

<style scoped lang="less">
.es-right {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

.tech-border {
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.45);
}

.es-user-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding-bottom: 4px;
}

.es-bell-wrap {
  position: relative;
  cursor: pointer;
}

.es-bell {
  font-size: 18px;
  color: #94a3b8;

  &:hover {
    color: #fff;
  }
}

.es-bell-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #e11d48;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 999px;
  border: 1px solid #334155;
  background: rgba(30, 41, 59, 0.45);
}

.es-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
}

.es-user-text {
  display: flex;
  flex-direction: column;
}

.es-uname {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.es-udept {
  font-size: 10px;
  color: #64748b;
}

.es-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.es-sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 6px;

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #f1f5f9;
  }
}

.es-sec-ico {
  font-size: 15px;
  color: #22d3ee;
}

.es-card--pie {
  height: 256px;
  flex-shrink: 0;
}

.es-pie-row {
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: center;
  padding: 0 8px 10px;
}

.es-pie-chart {
  width: 50%;
  height: 192px;
}

.es-pie-legend {
  width: 50%;
  padding-left: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.es-pie-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}

.es-pie-name {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
}

.es-pie-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.es-pie-val {
  display: flex;
  align-items: baseline;
  gap: 4px;

  b {
    font-size: 11px;
    color: #fff;
  }
}

.es-pie-pct {
  font-size: 9px;
  color: #64748b;
}

.es-card--rank {
  flex: 1 1 0;
  min-height: 120px;
}

.es-rank-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 12px 10px;
}

.es-rank-item {
  margin-bottom: 12px;
}

.es-rank-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  margin-bottom: 4px;
}

.es-rank-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.es-rank-idx {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  background: #1e293b;
  color: #94a3b8;

  &.top3 {
    background: #2563eb;
    color: #fff;
  }
}

.es-rank-name {
  color: #cbd5e1;
}

.es-rank-num {
  color: #94a3b8;
}

.es-rank-bar {
  height: 6px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.es-rank-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.es-card--info {
  height: 168px;
  flex-shrink: 0;
}

.es-info-body {
  padding: 0 12px 12px;
}

.es-info-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.es-info-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;

  &--r {
    background: #f43f5e;
    box-shadow: 0 0 8px #ef4444;
  }
  &--a {
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  }
}

.es-info-txt {
  margin: 0;
  font-size: 11px;
  color: #e2e8f0;
  line-height: 1.45;
}

.es-info-time {
  font-size: 10px;
  color: #64748b;
}

.custom-scroll {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.35);
    border-radius: 2px;
  }
}
</style>
