<template>
  <div class="warning-scroll">
    <div
      v-for="w in warnings"
      :key="w.id"
      class="warning-item"
    >
      <div class="warning-item__top">
        <div class="warning-item__tags">
          <WarningOutlined :class="['warning-item__tri', `warning-item__tri--${w.level}`]" />
          <span :class="['warning-item__lvl', levelClass(w.level)]">{{ levelLabel(w.level) }}</span>
          <span class="warning-item__type">{{ w.type }}</span>
        </div>
        <span :class="['warning-item__status', statusClass(w.status)]">{{ statusLabel(w.status) }}</span>
      </div>
      <div class="warning-item__loc">
        <EnvironmentOutlined class="warning-item__pin" />
        <span class="warning-item__loc-text">{{ w.location }}</span>
      </div>
      <div class="warning-item__time">
        <ClockCircleOutlined class="warning-item__clock" />
        <span>{{ w.time }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined, EnvironmentOutlined, WarningOutlined } from '@ant-design/icons-vue';

type Level = 'red' | 'orange' | 'yellow' | 'blue';
type Status = 'active' | 'processing' | 'resolved';

interface WarningRow {
  id: string;
  location: string;
  type: string;
  level: Level;
  time: string;
  status: Status;
}

const warnings: WarningRow[] = [
  { id: 'W001', location: '刘家峡镇黄河沿岸', type: '滑坡', level: 'red', time: '10分钟前', status: 'active' },
  { id: 'W002', location: '盐锅峡镇库区边坡', type: '滑坡', level: 'orange', time: '25分钟前', status: 'processing' },
  { id: 'W003', location: '太极镇黄土台塬', type: '滑坡', level: 'orange', time: '1小时前', status: 'processing' },
  { id: 'W006', location: '三塬镇黄土塬区', type: '崩塌', level: 'yellow', time: '4小时前', status: 'resolved' },
  { id: 'W007', location: '陈井镇山洪沟', type: '泥石流', level: 'yellow', time: '5小时前', status: 'resolved' },
  { id: 'W008', location: '关山乡沟道', type: '泥石流', level: 'yellow', time: '6小时前', status: 'resolved' },
];

function levelClass(level: Level) {
  return {
    red: 'lvl-red',
    orange: 'lvl-orange',
    yellow: 'lvl-yellow',
    blue: 'lvl-blue',
  }[level];
}

function levelLabel(level: Level) {
  return { red: '红色', orange: '橙色', yellow: '黄色', blue: '蓝色' }[level];
}

function statusLabel(status: Status) {
  return { active: '待处理', processing: '处理中', resolved: '已解除' }[status];
}

function statusClass(status: Status) {
  return {
    active: 'st-active',
    processing: 'st-processing',
    resolved: 'st-resolved',
  }[status];
}
</script>

<style lang="less" scoped>
.warning-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.25);
    border-radius: 4px;
  }
}

.warning-item {
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.4);
  background: rgba(30, 41, 59, 0.35);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(51, 65, 85, 0.45);
  }
}

.warning-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.warning-item__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.warning-item__tri {
  font-size: 16px;

  &--red {
    color: #ef4444;
  }
  &--orange {
    color: #f97316;
  }
  &--yellow {
    color: #eab308;
  }
  &--blue {
    color: #3b82f6;
  }
}

.warning-item__lvl {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.lvl-red {
  background: #ef4444;
  color: #fff;
}
.lvl-orange {
  background: #f97316;
  color: #fff;
}
.lvl-yellow {
  background: #eab308;
  color: #0c1220;
}
.lvl-blue {
  background: #3b82f6;
  color: #fff;
}

.warning-item__type {
  font-size: 12px;
  color: #94a3b8;
}

.warning-item__status {
  flex-shrink: 0;
  font-size: 12px;
}

.st-active {
  color: #ef4444;
}
.st-processing {
  color: #eab308;
}
.st-resolved {
  color: #22c55e;
}

.warning-item__loc {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #e2e8f0;
}

.warning-item__pin {
  flex-shrink: 0;
  font-size: 12px;
  color: #64748b;
}

.warning-item__loc-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.warning-item__time {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.warning-item__clock {
  font-size: 12px;
}
</style>
