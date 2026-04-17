<template>
  <div class="stat-card" :class="[`stat-card--${variant}`, { 'stat-card--compact': compact }]">
    <div class="stat-card__row">
      <div>
        <p class="stat-card__title">{{ title }}</p>
        <div class="stat-card__value-row">
          <span class="stat-card__value">{{ value }}</span>
          <span v-if="unit" class="stat-card__unit">{{ unit }}</span>
        </div>
        <p v-if="trend" class="stat-card__trend" :class="trend.isUp ? 'stat-card__trend--up' : 'stat-card__trend--down'">
          {{ trend.isUp ? '↑' : '↓' }} {{ Math.abs(trend.value) }}%
          <span class="stat-card__trend-note">较昨日</span>
        </p>
      </div>
      <div class="stat-card__icon-wrap" :class="`stat-card__icon-wrap--${variant}`">
        <component :is="icon" class="stat-card__icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    unit?: string;
    icon: Component;
    trend?: { value: number; isUp: boolean };
    variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
    compact?: boolean;
  }>(),
  { variant: 'default', compact: false },
);
</script>

<style lang="less" scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.5);
  background: rgba(30, 41, 59, 0.4);
  padding: 16px;

  &--danger {
    border-color: rgba(239, 68, 68, 0.35);
    background: rgba(239, 68, 68, 0.08);
  }
  &--warning {
    border-color: rgba(234, 179, 8, 0.35);
    background: rgba(234, 179, 8, 0.08);
  }
  &--success {
    border-color: rgba(34, 197, 94, 0.35);
    background: rgba(34, 197, 94, 0.08);
  }
  &--info {
    border-color: rgba(56, 189, 248, 0.35);
    background: rgba(56, 189, 248, 0.08);
  }
}

.stat-card__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.stat-card__title {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.stat-card__value-row {
  margin-top: 6px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-card__value {
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #f1f5f9;
}

.stat-card__unit {
  font-size: 14px;
  color: #94a3b8;
}

.stat-card__trend {
  margin: 8px 0 0;
  font-size: 12px;

  &--up {
    color: #ef4444;
  }
  &--down {
    color: #22c55e;
  }
}

.stat-card__trend-note {
  margin-left: 4px;
  color: #64748b;
}

.stat-card__icon-wrap {
  flex-shrink: 0;
  padding: 8px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.6);
  color: #94a3b8;

  &--danger {
    color: #ef4444;
  }
  &--warning {
    color: #eab308;
  }
  &--success {
    color: #22c55e;
  }
  &--info {
    color: #38bdf8;
  }
}

.stat-card__icon {
  display: block;
  font-size: 20px;
}

.stat-card--compact {
  padding: 8px 10px;
  border-radius: 8px;

  .stat-card__row {
    gap: 8px;
  }

  .stat-card__value-row {
    margin-top: 2px;
  }

  .stat-card__value {
    font-size: 20px;
  }

  .stat-card__unit {
    font-size: 12px;
  }

  .stat-card__trend {
    margin: 4px 0 0;
    font-size: 11px;
  }

  .stat-card__icon-wrap {
    padding: 5px;
    border-radius: 6px;
  }

  .stat-card__icon {
    font-size: 16px;
  }
}
</style>
