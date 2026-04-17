<template>
  <div class="hc-alerts">
    <button
      v-for="a in alerts"
      :key="a.id"
      type="button"
      class="hc-alert"
      @click="emit('select', a)"
    >
      <div class="hc-alert__top">
        <div class="hc-alert__title-row">
          <span class="hc-alert__dot" :class="`hc-alert__dot--${a.level.toLowerCase()}`" />
          <span class="hc-alert__type">{{ a.type }}</span>
        </div>
        <span class="hc-alert__time">{{ a.time }}</span>
      </div>
      <div class="hc-alert__ent">{{ a.enterprise }}</div>
      <div class="hc-alert__foot">
        <span class="hc-alert__region">{{ a.region }}</span>
        <span class="hc-alert__status" :class="statusClass(a.status)">{{ a.status }}</span>
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { HazardAlert } from './types';

defineProps<{ alerts: HazardAlert[] }>();

const emit = defineEmits<{ select: [HazardAlert] }>();

function statusClass(s: HazardAlert['status']) {
  if (s === '待处理') return 'hc-alert__status--red';
  if (s === '处理中') return 'hc-alert__status--orange';
  return 'hc-alert__status--green';
}
</script>

<style lang="less" scoped>
.hc-alerts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hc-alert {
  text-align: left;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  border-left: 4px solid #ef4444;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.hc-alert__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.hc-alert__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hc-alert__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
  box-shadow: 0 0 10px currentColor;

  &--red {
    background: #ef4444;
    color: rgba(239, 68, 68, 0.5);
  }
  &--orange {
    background: #f97316;
    color: rgba(249, 115, 22, 0.5);
  }
  &--yellow {
    background: #eab308;
    color: rgba(234, 179, 8, 0.5);
  }
  &--blue {
    background: #3b82f6;
    color: rgba(59, 130, 246, 0.5);
  }
}

.hc-alert__type {
  font-size: 13px;
  font-weight: 700;
  color: #e2e8f0;
}

.hc-alert__time {
  font-size: 10px;
  color: #64748b;
}

.hc-alert__ent {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.hc-alert__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hc-alert__region {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
}

.hc-alert__status {
  font-size: 10px;
  font-weight: 700;

  &--red {
    color: #f87171;
  }
  &--orange {
    color: #fb923c;
  }
  &--green {
    color: #4ade80;
  }
}
</style>
