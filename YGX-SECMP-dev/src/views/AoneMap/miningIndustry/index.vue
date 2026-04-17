<template>
  <BigScreenShell>
    <div class="mi-page">
    
      <main class="mi-main">
        <MiningLeft />
        <section class="mi-center">
          <MiningMap />
          <section class="mi-bottom">
            <h4>风险隐患发生趋势</h4>
            <MiningTrendChart />
          </section>
        </section>
        <MiningRight />
      </main>
      <div class="mi-glow mi-glow--tl" />
      <div class="mi-glow mi-glow--br" />
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import BigScreenShell from '../BigScreenShell.vue';
import MiningLeft from './MiningLeft.vue';
import MiningMap from './MiningMap.vue';
import MiningRight from './MiningRight.vue';
import MiningTrendChart from './MiningTrendChart.vue';
</script>

<style lang="less" scoped>
.mi-page {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #050b1a;
  color: #e2e8f0;
  overflow: hidden;
}
.mi-glow {
  position: absolute;
  pointer-events: none;
  width: 36%;
  height: 36%;
  border-radius: 999px;
  filter: blur(120px);
  z-index: 0;
}
.mi-glow--tl { left: -12%; top: -14%; background: rgba(37, 99, 235, 0.2); }
.mi-glow--br { right: -12%; bottom: -14%; background: rgba(6, 182, 212, 0.18); }
.mi-main,
.mi-bottom,
.mi-center {
  position: relative;
  z-index: 1;
}
.mi-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
}
.mi-center {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mi-bottom {
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.15);
  background: rgba(8, 17, 36, 0.72);
  padding: 8px 12px;
  flex-shrink: 0;
  box-shadow: inset 0 0 24px rgba(56, 189, 248, 0.08);
}
.mi-bottom h4 {
  margin: 0 0 4px;
  font-size: 12px;
  color: #67e8f9;
}
</style>
