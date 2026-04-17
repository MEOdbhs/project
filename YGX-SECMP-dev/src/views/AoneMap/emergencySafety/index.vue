<template>
  <BigScreenShell>
    <div class="es-page">
      <div class="es-main">
        <EmergencySafetyLeft />
        <EmergencySafetyCenter />
        <EmergencySafetyRight />
      </div>
      <div class="es-bg" aria-hidden="true">
        <div class="es-bg-grad es-bg-grad--t" />
        <div class="es-bg-grad es-bg-grad--b" />
      </div>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import BigScreenShell from '../BigScreenShell.vue';
import EmergencySafetyCenter from './EmergencySafetyCenter.vue';
import EmergencySafetyLeft from './EmergencySafetyLeft.vue';
import EmergencySafetyRight from './EmergencySafetyRight.vue';
</script>

<style scoped lang="less">
.es-page {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #020617;
  color: #e2e8f0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  user-select: none;
}

.es-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(280px, 380px) minmax(0, 1fr) minmax(260px, 320px);
  grid-template-rows: minmax(0, 1fr);
  gap: 16px;
  padding: 12px 16px 16px;
  overflow: hidden;
  align-items: stretch;
}

.es-main > * {
  min-height: 0;
}

.es-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.es-bg-grad {
  position: absolute;
  left: 0;
  width: 100%;
  height: 120px;

  &--t {
    top: 0;
    background: linear-gradient(180deg, rgba(30, 58, 138, 0.2), transparent);
  }

  &--b {
    bottom: 0;
    background: linear-gradient(0deg, rgba(30, 58, 138, 0.2), transparent);
  }
}

@media (max-width: 1200px) {
  .es-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    overflow-y: auto;
  }
}
</style>
