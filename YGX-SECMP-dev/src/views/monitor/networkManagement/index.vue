<template>
  <div class="px-[24px] py-[10px] bg-[#0b1c36]">
    <a-tabs :defaultActiveKey="searchInfo.logType" @change="tabChange" size="small">
      <!-- <a-tab-pane tab="设备在线监测" key="1"></a-tab-pane> -->
      <a-tab-pane tab="告警信息" key="2"></a-tab-pane>
      <a-tab-pane tab="运维报表" key="3"></a-tab-pane>
      <a-tab-pane tab="巡检计划" key="4"></a-tab-pane>
    </a-tabs>
  </div>
  
  <!-- 根据tab切换显示不同的表格组件 -->
  <DeviceMonitoringTable v-if="searchInfo.logType === '1'" :searchInfo="searchInfo" ref="deviceMonitoringRef" />
  <AlarmInfoTable v-else-if="searchInfo.logType === '2'" :searchInfo="searchInfo" ref="alarmInfoRef" />
  <OperationReportTable v-else-if="searchInfo.logType === '3'" :searchInfo="searchInfo" ref="operationReportRef" />
  <InspectionPlanTable v-else-if="searchInfo.logType === '4'" :searchInfo="searchInfo" ref="inspectionPlanRef" />
</template>

<script name="network-management" setup lang="ts">
import { ref,reactive } from 'vue';
import DeviceMonitoringTable from './components/DeviceMonitoringTable.vue';
import AlarmInfoTable from './components/AlarmInfoTable.vue';
import OperationReportTable from './components/OperationReportTable.vue';
import InspectionPlanTable from './components/InspectionPlanTable.vue';

// 搜索信息
const searchInfo = reactive({ logType: '2' });

// 组件引用
const deviceMonitoringRef = ref();
const alarmInfoRef = ref();
const operationReportRef = ref();
const inspectionPlanRef = ref();

// 日志类型切换
function tabChange(key) {
  searchInfo.logType = key;
  
  // 切换tab后，触发对应组件的reload方法
  setTimeout(() => {
    switch(key) {
      case '1':
        deviceMonitoringRef.value?.reload();
        break;
      case '2':
        alarmInfoRef.value?.reload();
        break;
      case '3':
        operationReportRef.value?.reload();
        break;
      case '4':
        inspectionPlanRef.value?.reload();
        break;
    }
  }, 0);
}
</script>
