<template>
  <aside class="hc-left">
    <GeologicalPanel title="核心统计信息" :icon="BarChartOutlined">
      <HazardCoreStats />
    </GeologicalPanel>

    <GeologicalPanel title="企业类型分布" :icon="PieChartOutlined" class="hc-left__grow">
      <EnterpriseTypePieChart :data="pieData" />
    </GeologicalPanel>

    <GeologicalPanel title="运输环节实时监控" :icon="CarOutlined" class="hc-left__transport">
      <HazardTransportList :vehicles="TRANSPORT_VEHICLES" />
    </GeologicalPanel>

    <GeologicalPanel title="实时预警信息" :icon="BellOutlined" class="hc-left__alerts">
      <HazardAlertList :alerts="MOCK_ALERTS" @select="onAlert" />
    </GeologicalPanel>
  </aside>
</template>

<script lang="ts" setup>
import { BarChartOutlined, BellOutlined, CarOutlined, PieChartOutlined } from '@ant-design/icons-vue';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import EnterpriseTypePieChart from './EnterpriseTypePieChart.vue';
import HazardAlertList from './HazardAlertList.vue';
import HazardCoreStats from './HazardCoreStats.vue';
import HazardTransportList from './HazardTransportList.vue';
import { enterprisePieSeries, MOCK_ALERTS, TRANSPORT_VEHICLES } from './mockData';
import type { DetailPayload, HazardAlert } from './types';

const emit = defineEmits<{ 'open-detail': [DetailPayload] }>();

const pieData = enterprisePieSeries();

function onAlert(a: HazardAlert) {
  emit('open-detail', {
    name: a.type,
    enterprise: a.enterprise,
    region: a.region,
    type: a.type,
  });
}
</script>

<style lang="less" scoped>
.hc-left {
  width: min(400px, 30vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }
}

.hc-left__grow {
  flex: 1;
  min-height: 260px;
}

.hc-left__transport {
  flex-shrink: 0;
  min-height: 200px;
}

.hc-left__alerts {
  flex: 1;
  min-height: 320px;
}
</style>
