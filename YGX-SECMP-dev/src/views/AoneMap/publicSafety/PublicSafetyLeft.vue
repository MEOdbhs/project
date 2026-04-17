<template>
  <aside class="ps-side">
    <PublicSafetyStatCard title="监测点位总数" :value="819" unit="台" :trend="{ value: 12, isUp: true }" />

    <GeologicalPanel title="高清/热成像高频 · 活动时段监测" :icon="CameraOutlined" class="ps-grow">
      <MonitorHdThermalCurve :data="monitorActivityCurveData" />
    </GeologicalPanel>

    <GeologicalPanel title="AI研判告警（今日·识别类型）" :icon="AlertOutlined" class="ps-grow">
      <AlarmSceneBar :data="alarmSceneData" />
    </GeologicalPanel>

    <GeologicalPanel title="重点区域风险排行" :icon="SafetyOutlined">
      <div class="ps-rank">
        <div v-for="(item, index) in riskRankingData" :key="item.name" class="ps-rank__row">
          <span class="ps-rank__name">{{ index + 1 }}. {{ item.name }}</span>
          <span class="ps-rank__score">{{ item.score }}</span>
        </div>
      </div>
    </GeologicalPanel>
  </aside>
</template>

<script lang="ts" setup>
import { AlertOutlined, CameraOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import AlarmSceneBar from './AlarmSceneBar.vue';
import MonitorHdThermalCurve from './MonitorHdThermalCurve.vue';
import PublicSafetyStatCard from './PublicSafetyStatCard.vue';
import { alarmSceneData, monitorActivityCurveData, riskRankingData } from './mockData';
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
.ps-grow { min-height: 280px; }
.ps-rank { display: flex; flex-direction: column; gap: 8px; }
.ps-rank__row { display: flex; justify-content: space-between; font-size: 12px; color: #cbd5e1; }
.ps-rank__score { color: #38bdf8; font-weight: 600; }
</style>
