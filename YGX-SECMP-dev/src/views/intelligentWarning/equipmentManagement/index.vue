<!-- index.vue - 设备管理列表页 -->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button v-auth="'rescue-outbound:add'" type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">
        新增设备
      </a-button>
      <a-button v-auth="'rescue-outbound:add'" style="margin-left: 10px;" type="primary" @click="handleYWYJPZ">
        运维预警配置
      </a-button>
    </template>
    <template #onlineStatus="{ record }">
      <a-tag :color="record.onlineStatus === 'Y' ? 'green' : 'red'">
        {{ record.onlineStatus === 'Y' ? '在线' : '离线' }}
      </a-tag>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
  <RealTimeMonitorModal @register="registerMonitorModal" />
  <RuleConfigModal @register="registerRuleModal" />
  <MaintenanceCalibrationModal @register="registerCalibrationModal" />
</template>

<script lang="ts" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import RealTimeMonitorModal from './components/RealTimeMonitorModal.vue';
import AddOrEditData from './components/AddOrEditData.vue';
import RuleConfigModal from './components/RuleConfigModal.vue'; // 新增
import MaintenanceCalibrationModal from './components/MaintenanceCalibrationModal.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';
const [registerModal, { openModal }] = useModal()
const [registerMonitorModal, { openModal: openMonitorModal }] = useModal();
const [registerRuleModal, { openModal: openRuleModal }] = useModal(); // 新增

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'device-management',
  tableProps: {
    title: '设备管理',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 120,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
  },
});
const [registerTable, { reload }] = tableContext;
// 在组件内注册模态框
const [registerCalibrationModal, { openModal: openCalibrationModal }] = useModal();

/**
 * 运维预警配置 - 打开规则配置弹窗
 */
function handleYWYJPZ() {
  openRuleModal(true);
}
/**
* 新增
*/
function handleAdd() {
  openModal(true, { type: 'add', row: null, isUpdate: false })
}

/**
 * 编辑
 */
function handleBasicInfo(record) {
  openModal(true, { type: 'edit', row: record, isUpdate: true })
}


/**
 * 实时监控 - 打开弹窗
 */
function handleRealTimeMonitor(record) {
  openMonitorModal(true, { device: record });
}

/**
 * 维护校准（预留操作）
 */
 function handleMaintenance(record) {
  openCalibrationModal(true, { device: record });
}

/**
 * 操作栏配置
 */
function getTableAction(record) {
  return [
    {
      label: '基础信息',
      onClick: handleBasicInfo.bind(null, record),
    },
    {
      label: '实时监控',
      onClick: handleRealTimeMonitor.bind(null, record),
    },
    {
      label: '维护校准',
      onClick: handleMaintenance.bind(null, record),
    },
  ];
}
</script>

<style scoped>
.table-title {
  font-size: 16px;
  font-weight: 500;
}
</style>