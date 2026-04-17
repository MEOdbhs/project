<template>
  <aside class="ps-side">


    <GeologicalPanel title="24小时告警趋势" :icon="LineChartOutlined" class="ps-grow">
      <AlarmTrendArea :data="alarmTrendData" />
    </GeologicalPanel>

    <GeologicalPanel title="重点场景智能监管" :icon="AppstoreOutlined">
      <div class="ps-scene">
        <div v-for="item in sceneStatsData" :key="item.name" class="ps-scene__item">
          <span class="ps-scene__name">{{ item.name }}</span>
          <span class="ps-scene__count">{{ item.count }}</span>
          <span class="ps-scene__status">{{ item.status }}</span>
        </div>
      </div>
    </GeologicalPanel>

    <GeologicalPanel title="实时告警动态" :icon="BellOutlined">
      <div class="ps-feed">
        <div v-for="item in alarmFeedData" :key="item.id" class="ps-feed__item">
          <div class="ps-feed__top"><b>{{ item.type }}告警</b><span>{{ item.time }}</span></div>
          <div class="ps-feed__loc">{{ item.location }}</div>
        </div>
      </div>
    </GeologicalPanel>
  </aside>
</template>

<script lang="ts" setup>
import { AppstoreOutlined, BellOutlined, LineChartOutlined } from '@ant-design/icons-vue';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import AlarmTrendArea from './AlarmTrendArea.vue';
import { alarmFeedData, alarmTrendData, sceneStatsData } from './mockData';
</script>

<style lang="less" scoped>
.ps-side {
  width: min(380px, 28vw);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
}

.ps-grow {
  min-height: 280px;
}

.ps-run-state {
  flex-shrink: 0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.75) 100%);
  box-shadow:
    0 0 0 1px rgba(34, 211, 238, 0.06),
    0 12px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.ps-run-state__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.ps-run-state__title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #67e8f9;
  text-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
}

.ps-run-state__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35), 0 0 14px rgba(34, 197, 94, 0.65);
  animation: ps-pulse 2s ease-in-out infinite;
}

@keyframes ps-pulse {
  50% {
    opacity: 0.75;
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.2), 0 0 20px rgba(34, 197, 94, 0.5);
  }
}

.ps-run-state__main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ps-run-state__value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.06em;
  background: linear-gradient(180deg, #ecfdf5 0%, #34d399 45%, #059669 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 12px rgba(52, 211, 153, 0.35));
}

.ps-run-state__hint {
  font-size: 10px;
  line-height: 1.45;
  color: #94a3b8;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
}

.ps-scene {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.ps-scene__item {
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 8px;
}

.ps-scene__name {
  font-size: 10px;
  color: #94a3b8;
  display: block;
}

.ps-scene__count {
  font-size: 18px;
  color: #f8fafc;
  font-weight: 700;
  margin-right: 6px;
}

.ps-scene__status {
  font-size: 10px;
  color: #22d3ee;
}

.ps-feed {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ps-feed__item {
  border-left: 2px solid #334155;
  padding-left: 8px;
}

.ps-feed__top {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #cbd5e1;
}

.ps-feed__loc {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
}
</style>
