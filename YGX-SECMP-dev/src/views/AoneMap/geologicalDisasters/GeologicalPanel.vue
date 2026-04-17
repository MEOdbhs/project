<template>
  <div class="geo-panel" :class="rootClass">
    <div class="geo-panel__head">
      <div class="geo-panel__title-row">
        <component :is="icon" v-if="icon" class="geo-panel__icon" />
        <h3 class="geo-panel__title">{{ title }}</h3>
      </div>
      <div v-if="$slots.action" class="geo-panel__action">
        <slot name="action" />
      </div>
    </div>
    <div class="geo-panel__body" :class="{ 'geo-panel__body--flush': flushBody }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    title: string;
    icon?: Component;
    rootClass?: string;
    flushBody?: boolean;
  }>(),
  { flushBody: false },
);
</script>

<style lang="less" scoped>
.geo-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.15);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.geo-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.12);
}

.geo-panel__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.geo-panel__icon {
  flex-shrink: 0;
  font-size: 16px;
  color: #38bdf8;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5));
}

.geo-panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
}

.geo-panel__body {
  flex: 1;
  min-height: 0;
  padding: 16px;

  &--flush {
    padding: 0;
  }
}
</style>
