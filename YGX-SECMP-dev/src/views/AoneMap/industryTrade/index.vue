<template>
  <BigScreenShell>
    <div class="it-page">
      <div class="it-page__glow it-page__glow--tl" />
      <div class="it-page__glow it-page__glow--br" />
      <main class="it-main">
        <IndustryTradeLeft />
        <IndustryTradeMap />
        <IndustryTradeRight />
      </main>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import BigScreenShell from '../BigScreenShell.vue';
import IndustryTradeLeft from './IndustryTradeLeft.vue';
import IndustryTradeMap from './IndustryTradeMap.vue';
import IndustryTradeRight from './IndustryTradeRight.vue';
</script>

<style lang="less" scoped>
.it-page {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #050505;
  color: #fff;
}

.it-page__glow {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(120px);
  z-index: 0;

  &--tl {
    top: -20%;
    left: -10%;
    width: 50%;
    height: 50%;
    background: rgba(6, 182, 212, 0.05);
  }

  &--br {
    bottom: -20%;
    right: -10%;
    width: 50%;
    height: 50%;
    background: rgba(59, 130, 246, 0.05);
  }
}

.it-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
</style>
