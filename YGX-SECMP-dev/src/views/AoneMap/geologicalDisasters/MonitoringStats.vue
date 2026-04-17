<template>
  <div class="mon-grid">
    <div v-for="item in monitoringData" :key="item.label" class="mon-card">
      <div class="mon-card__top">
        <component :is="item.icon" class="mon-card__icon" />
        <span :class="['mon-card__dot', item.status === 'normal' ? 'mon-card__dot--ok' : 'mon-card__dot--warn']" />
      </div>
      <p class="mon-card__value">{{ formatNum(item.value) }}</p>
      <p class="mon-card__label">{{ item.label }}</p>
      <p class="mon-card__online">
        在线 {{ formatNum(item.online) }} ({{ onlinePct(item) }}%)
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';
import { ApiOutlined, CloudServerOutlined, RadarChartOutlined, WifiOutlined } from '@ant-design/icons-vue';

interface MonItem {
  label: string;
  value: number;
  online: number;
  icon: Component;
  status: 'normal' | 'warning';
}

const monitoringData: MonItem[] = [
  { label: '监测站点', value: 2847, online: 2756, icon: RadarChartOutlined, status: 'normal' },
  { label: '传感器数', value: 12568, online: 12234, icon: ApiOutlined, status: 'normal' },
  { label: '数据中心', value: 24, online: 24, icon: CloudServerOutlined, status: 'normal' },
  { label: '通信链路', value: 156, online: 152, icon: WifiOutlined, status: 'warning' },
];

function formatNum(n: number) {
  return n.toLocaleString('zh-CN');
}

function onlinePct(item: MonItem) {
  return ((item.online / item.value) * 100).toFixed(1);
}
</script>

<style lang="less" scoped>
.mon-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mon-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.45);
  background: rgba(30, 41, 59, 0.35);
}

.mon-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mon-card__icon {
  font-size: 16px;
  color: #38bdf8;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.35));
}

.mon-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;

  &--ok {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
  }
  &--warn {
    background: #eab308;
    box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
  }
}

.mon-card__value {
  margin: 10px 0 0;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #f1f5f9;
}

.mon-card__label {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.mon-card__online {
  margin: 6px 0 0;
  font-size: 12px;
  color: #22c55e;
}
</style>
