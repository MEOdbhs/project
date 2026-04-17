<template>
  <aside class="hc-right">
    <GeologicalPanel title="存储环节专项统计" :icon="DatabaseOutlined">
      <HazardTankList :tanks="TANK_MONITORING" />
    </GeologicalPanel>

    <GeologicalPanel title="从业人员资质" :icon="TeamOutlined">
      <HazardPersonnelPanel />
    </GeologicalPanel>

    <GeologicalPanel title="化工园区风险评估" :icon="AlertOutlined" class="hc-right__grow">
      <HazardParkRiskPanel />
    </GeologicalPanel>
  </aside>
</template>

<script lang="ts" setup>
import { AlertOutlined, DatabaseOutlined, TeamOutlined } from '@ant-design/icons-vue';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import HazardParkRiskPanel from './HazardParkRiskPanel.vue';
import HazardPersonnelPanel from './HazardPersonnelPanel.vue';
import HazardTankList from './HazardTankList.vue';
import { TANK_MONITORING } from './mockData';
</script>

<style lang="less" scoped>
.hc-right {
  width: min(400px, 30vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  padding-left: 4px;

  /* 避免默认 flex-shrink:1 把前两块压扁后内容溢出叠到下方面板上 */
  > :deep(.geo-panel:not(.hc-right__grow)) {
    flex-shrink: 0;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }
}

.hc-right__grow {
  flex: 1 1 auto;
  min-height: 200px;
}
</style>
