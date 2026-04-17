<template>
  <div class="ps-stat">
    <div class="ps-stat__body">
      <div class="ps-stat__title">{{ title }}</div>
      <div class="ps-stat__val">{{ value }}<span v-if="unit" class="ps-stat__unit">{{ unit }}</span></div>
      <div v-if="trend" class="ps-stat__trend" :class="{ 'ps-stat__trend--up': trend.isUp }">
        {{ trend.isUp ? '↑' : '↓' }} {{ trend.value }}%
      </div>
    </div>
    <div v-if="icon" class="ps-stat__icon" :class="`ps-stat__icon--${color}`">
      <component :is="icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';

defineProps<{
  title: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; isUp: boolean };
  icon?: Component;
  color?: 'blue' | 'green' | 'red' | 'orange';
}>();
</script>

<style lang="less" scoped>
.ps-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  min-height: 88px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.15);
  background: rgba(15, 23, 42, 0.45);
}

.ps-stat__body {
  flex: 1;
  min-width: 0;
}

.ps-stat__title {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.3;
}

.ps-stat__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(56, 189, 248, 0.12);
  color: #67e8f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ps-stat__icon :deep(svg) {
  width: 1em;
  height: 1em;
}

.ps-stat__icon--red {
  border-color: rgba(239, 68, 68, 0.4);
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.22), rgba(239, 68, 68, 0.08));
  color: #fca5a5;
  box-shadow: 0 0 22px rgba(239, 68, 68, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ps-stat__icon--green {
  border-color: rgba(34, 197, 94, 0.4);
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.22), rgba(34, 197, 94, 0.08));
  color: #86efac;
  box-shadow: 0 0 22px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ps-stat__icon--blue {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.22), rgba(59, 130, 246, 0.08));
  color: #93c5fd;
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ps-stat__icon--orange {
  border-color: rgba(249, 115, 22, 0.4);
  background: linear-gradient(145deg, rgba(249, 115, 22, 0.22), rgba(249, 115, 22, 0.08));
  color: #fdba74;
  box-shadow: 0 0 22px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ps-stat__val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.2;
}

.ps-stat__unit {
  margin-left: 2px;
  font-size: 12px;
  color: #64748b;
}

.ps-stat__trend {
  margin-top: 4px;
  font-size: 10px;
  color: #22c55e;
}

.ps-stat__trend--up {
  color: #ef4444;
}
</style>
