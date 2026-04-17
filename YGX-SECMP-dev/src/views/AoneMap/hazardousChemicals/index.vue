<template>
  <BigScreenShell>
    <div class="hc-page">
      <main class="hc-main">
        <HazardChemLeft @open-detail="openDetail" />
        <HazardMapPanel @open-detail="openDetail" />
        <HazardChemRight />
      </main>
      <footer class="hc-foot">
        <span>数据来源：全省危化品监管联网平台</span>
        <span>更新频率：实时</span>
        <span class="hc-foot__sep" />
        <span class="hc-foot__ok"><i class="hc-foot__dot" />数据库连接正常</span>
        <span class="hc-foot__ok"><i class="hc-foot__dot" />GIS服务在线</span>
        <span>版本: v2.4.0</span>
      </footer>
      <HazardDetailModal v-model="modalOpen" :detail="detailPayload" />
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import BigScreenShell from '../BigScreenShell.vue';
import HazardChemLeft from './HazardChemLeft.vue';
import HazardChemRight from './HazardChemRight.vue';
import HazardDetailModal from './HazardDetailModal.vue';
import HazardMapPanel from './HazardMapPanel.vue';
import type { DetailPayload } from './types';

const modalOpen = ref(false);
const detailPayload = ref<DetailPayload | null>(null);

function openDetail(d: DetailPayload) {
  detailPayload.value = d;
  modalOpen.value = true;
}
</script>

<style lang="less" scoped>
.hc-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(ellipse 100% 80% at 50% -10%, rgba(56, 189, 248, 0.1), transparent),
    linear-gradient(180deg, #0a0f18 0%, #070b12 50%, #050810 100%);
  color: #e2e8f0;
}

.hc-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
  padding: 12px 12px 0;
  overflow: hidden;
}

.hc-foot {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  padding: 8px 16px;
  margin: 0 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.12);
  background: rgba(15, 23, 42, 0.5);
  font-size: 10px;
  color: #64748b;
}

.hc-foot__sep {
  flex: 1;
  min-width: 8px;
}

.hc-foot__ok {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hc-foot__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
}
</style>
