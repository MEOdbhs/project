<template>
  <div>
    <!-- 一级 Tab：基础属性、风险隐患、防护设施 -->
    <a-tabs v-model:activeKey="activeMainTab" @change="handleMainTabChange">
      <!-- 基础属性信息（原有表格） -->
      <a-tab-pane key="base" tab="基础属性信息">
        <BasicTable @register="registerBaseTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddBase">新增</a-button>
          </template>
          <template #action="{ record }">
            <TableAction :actions="getBaseTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>

      <!-- 风险隐患信息 -->
      <a-tab-pane key="risk" tab="风险隐患信息">
        <!-- 搜索条件（可选，按原型图放在表格上方） -->
        <!-- <div class="search-wrapper" v-if="activeMainTab === 'risk'">
          <a-form layout="horizontal" :model="riskSearchParams" @finish="handleRiskSearch">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="影响等级" name="impactLevel" class="jeecg-online-search">
                  <a-input v-model:value="riskSearchParams.impactLevel" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="开始日期至结束日期" name="dateRange" class="jeecg-online-search">
                  <a-range-picker v-model:value="riskSearchParams.dateRange" format="YYYY-MM-DD" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item class="jeecg-online-search">
                  <a-button type="primary" html-type="submit">搜索</a-button>
                  <a-button style="margin-left: 8px" @click="resetRiskSearch">重置</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

        </div> -->
        <BasicTable @register="registerRiskTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddRisk">新增</a-button>
          </template>
          <template #action="{ record }">
            <TableAction :actions="getRiskTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>

      <!-- 防护设施及管控信息（二级Tab） -->
      <a-tab-pane key="protect" tab="防护设施及管控信息">
        <a-tabs v-model:activeKey="activeProtectTab" @change="handleProtectTabChange" :tabPosition="'top'">
          <!-- 监测预警设施 -->
          <a-tab-pane key="monitor" tab="监测预警设施">
            <BasicTable @register="registerMonitorTable">
              <template #tableTitle>
                <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddMonitor">新增</a-button>
              </template>
              <template #action="{ record }">
                <TableAction :actions="getMonitorTableAction(record)" />
              </template>
            </BasicTable>
          </a-tab-pane>

          <!-- 工程防护及应急加固设施 -->
          <a-tab-pane key="engineering" tab="工程防护及应急加固设施">
            <BasicTable @register="registerEngineeringTable">
              <template #tableTitle>
                <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddEngineering">新增</a-button>
              </template>
              <template #action="{ record }">
                <TableAction :actions="getEngineeringTableAction(record)" />
              </template>
            </BasicTable>
          </a-tab-pane>

          <!-- 日常管控（三级Tab） -->
          <a-tab-pane key="daily" tab="日常管控">
            <a-tabs v-model:activeKey="activeDailyTab" @change="handleDailyTabChange">
              <!-- 管理制度 -->
              <a-tab-pane key="management" tab="管理制度">
                <BasicTable @register="registerManagementTable">
                  <template #tableTitle>
                    <a-button type="primary" preIcon="ant-design:plus-outlined"
                      @click="handleAddManagement">新增</a-button>
                  </template>
                  <template #action="{ record }">
                    <TableAction :actions="getManagementTableAction(record)" />
                  </template>
                </BasicTable>
              </a-tab-pane>

              <!-- 工程管控范围 -->
              <a-tab-pane key="scope" tab="工程管控范围">
                <BasicTable @register="registerScopeTable">
                  <template #tableTitle>
                    <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddScope">新增</a-button>
                  </template>
                  <template #action="{ record }">
                    <TableAction :actions="getScopeTableAction(record)" />
                  </template>
                </BasicTable>
              </a-tab-pane>

              <!-- 警示标识设置情况 -->
              <a-tab-pane key="sign" tab="警示标识设置情况">
                <BasicTable @register="registerSignTable">
                  <template #tableTitle>
                    <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAddSign">新增</a-button>
                  </template>
                  <template #action="{ record }">
                    <TableAction :actions="getSignTableAction(record)" />
                  </template>
                </BasicTable>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>

    <!-- 各个Tab对应的新增/编辑弹窗 -->
    <AddOrEditBase @register="registerBaseModal" @success="reloadBase" />
    <AddOrEditRisk @register="registerRiskModal" @success="reloadRisk" />
    <AddOrEditMonitor @register="registerMonitorModal" @success="reloadMonitor" />
    <AddOrEditEngineering @register="registerEngineeringModal" @success="reloadEngineering" />
    <AddOrEditManagement @register="registerManagementModal" @success="reloadManagement" />
    <AddOrEditScope @register="registerScopeModal" @success="reloadScope" />
    <AddOrEditSign @register="registerSignModal" @success="reloadSign" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';

// 导入各个Tab的列定义、搜索表单、API
import {
  baseColumns,
  baseSearchForm,
  riskColumns,
  riskSearchForm,
  siteNameForm,
  systemNameForm,
  scopeForm,
  identificationNameForm,
  monitorColumns,
  engineeringColumns,
  protectionForm,
  managementColumns,
  scopeColumns,
  signColumns,
} from './line.data';
import {
  listBasePage,
  deleteBase,
  listRiskPage,
  deleteRisk,
  listMonitorPage,
  deleteMonitor,
  listEngineeringPage,
  deleteEngineering,
  listManagementPage,
  deleteManagement,
  listScopePage,
  deleteScope,
  listSignPage,
  deleteSign,
} from './line.api';

// 导入各个弹窗组件
import AddOrEditBase from './components/AddOrEditBase.vue';
import AddOrEditRisk from './components/AddOrEditRisk.vue';
import AddOrEditMonitor from './components/AddOrEditMonitor.vue';
import AddOrEditEngineering from './components/AddOrEditEngineering.vue';
import AddOrEditManagement from './components/AddOrEditManagement.vue';
import AddOrEditScope from './components/AddOrEditScope.vue';
import AddOrEditSign from './components/AddOrEditSign.vue';

// 当前激活的主Tab
const activeMainTab = ref('base');
// 当前激活的二级Tab（防护设施下）
const activeProtectTab = ref('monitor');
// 当前激活的三级Tab（日常管控下）
const activeDailyTab = ref('management');

// ----- 基础信息表格 -----
const [registerBaseModal, { openModal: openBaseModal }] = useModal();
const { tableContext: baseTableContext } = useListPage({
  designScope: 'base-info',
  tableProps: {
    api: listBasePage,
    columns: baseColumns,
    showIndexColumn: true,
    formConfig: {
      schemas: baseSearchForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
      fieldMapToTime: [['dateRange', ['buildTimeStart', 'buildTimeEnd'], 'YYYY-MM-DD']],
    },
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerBaseTable, { reload: reloadBase }] = baseTableContext;
function handleAddBase() {
  openBaseModal(true, { type: 'add' });
}
function handleEditBase(record) {
  openBaseModal(true, { type: 'edit', row: record });
}
function handleViewBase(record) {
  openBaseModal(true, { type: 'view', row: record });
}
async function handleDeleteBase(record) {
  await deleteBase({ id: record.id }, reloadBase);
}
function getBaseTableAction(record) {
  return [
    { label: '查看', onClick: handleViewBase.bind(null, record) },
    { label: '编辑', onClick: handleEditBase.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteBase.bind(null, record) },
    },
  ];
}

// ----- 风险隐患信息表格 -----
const riskSearchParams = reactive({
  impactLevel: '',
  dateRange: [],
});
const [registerRiskModal, { openModal: openRiskModal }] = useModal();
const { tableContext: riskTableContext } = useListPage({
  designScope: 'risk-info',
  tableProps: {
    api: listRiskPage,
    columns: riskColumns,
    showIndexColumn: true,
    formConfig: {
      schemas: riskSearchForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
      fieldMapToTime: [['dateRange', ['occurTimeStart', 'occurTimeEnd'], 'YYYY-MM-DD']],
    },
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerRiskTable, { reload: reloadRisk }] = riskTableContext;

function handleRiskSearch() {
  // 手动调用刷新，传递搜索参数
  reloadRisk({ ...riskSearchParams });
}
function resetRiskSearch() {
  riskSearchParams.impactLevel = '';
  riskSearchParams.dateRange = [];
  reloadRisk();
}
function handleAddRisk() {
  openRiskModal(true, { type: 'add' });
}
function handleEditRisk(record) {
  openRiskModal(true, { type: 'edit', row: record });
}
function handleViewRisk(record) {
  openRiskModal(true, { type: 'view', row: record });
}
async function handleDeleteRisk(record) {
  await deleteRisk({ id: record.id }, reloadRisk);
}
function getRiskTableAction(record) {
  return [
    { label: '查看', onClick: handleViewRisk.bind(null, record) },
    { label: '编辑', onClick: handleEditRisk.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteRisk.bind(null, record) },
    },
  ];
}

// ----- 监测预警设施表格 -----
const [registerMonitorModal, { openModal: openMonitorModal }] = useModal();
const { tableContext: monitorTableContext } = useListPage({
  designScope: 'monitor',
  tableProps: {
    api: listMonitorPage,
    columns: monitorColumns,
    showIndexColumn: true,
    formConfig: {
      schemas: siteNameForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
      fieldMapToTime: [['dateRange', ['occurTimeStart', 'occurTimeEnd'], 'YYYY-MM-DD']],
    },
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerMonitorTable, { reload: reloadMonitor }] = monitorTableContext;

function handleAddMonitor() {
  openMonitorModal(true, { type: 'add' });
}
function handleEditMonitor(record) {
  openMonitorModal(true, { type: 'edit', row: record });
}
function handleViewMonitor(record) {
  openMonitorModal(true, { type: 'view', row: record });
}
async function handleDeleteMonitor(record) {
  await deleteMonitor({ id: record.id }, reloadMonitor);
}
function getMonitorTableAction(record) {
  return [
    { label: '查看', onClick: handleViewMonitor.bind(null, record) },
    { label: '编辑', onClick: handleEditMonitor.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteMonitor.bind(null, record) },
    },
  ];
}

// ----- 工程防护及应急加固设施表格 -----
const [registerEngineeringModal, { openModal: openEngineeringModal }] = useModal();
const { tableContext: engineeringTableContext } = useListPage({
  designScope: 'engineering',
  tableProps: {
    api: listEngineeringPage,
    columns: engineeringColumns,
    showIndexColumn: true,
    formConfig: {
      schemas: protectionForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
    },
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerEngineeringTable, { reload: reloadEngineering }] = engineeringTableContext;

function handleAddEngineering() {
  openEngineeringModal(true, { type: 'add' });
}
function handleEditEngineering(record) {
  openEngineeringModal(true, { type: 'edit', row: record });
}
function handleViewEngineering(record) {
  openEngineeringModal(true, { type: 'view', row: record });
}
async function handleDeleteEngineering(record) {
  await deleteEngineering({ id: record.id }, reloadEngineering);
}
function getEngineeringTableAction(record) {
  return [
    { label: '查看', onClick: handleViewEngineering.bind(null, record) },
    { label: '编辑', onClick: handleEditEngineering.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteEngineering.bind(null, record) },
    },
  ];
}

// ----- 管理制度表格 -----
const [registerManagementModal, { openModal: openManagementModal }] = useModal();
const { tableContext: managementTableContext } = useListPage({
  designScope: 'management',
  tableProps: {
    api: listManagementPage,
    columns: managementColumns,
    formConfig: {
      schemas: systemNameForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
    },
    showIndexColumn: true,
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerManagementTable, { reload: reloadManagement }] = managementTableContext;

function handleAddManagement() {
  openManagementModal(true, { type: 'add' });
}
function handleEditManagement(record) {
  openManagementModal(true, { type: 'edit', row: record });
}
function handleViewManagement(record) {
  openManagementModal(true, { type: 'view', row: record });
}
async function handleDeleteManagement(record) {
  await deleteManagement({ id: record.id }, reloadManagement);
}
function getManagementTableAction(record) {
  return [
    { label: '查看', onClick: handleViewManagement.bind(null, record) },
    { label: '编辑', onClick: handleEditManagement.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteManagement.bind(null, record) },
    },
  ];
}

// ----- 工程管控范围表格 -----
const [registerScopeModal, { openModal: openScopeModal }] = useModal();
const { tableContext: scopeTableContext } = useListPage({
  designScope: 'scope',
  tableProps: {
    api: listScopePage,
    columns: scopeColumns,
    showIndexColumn: true,
    formConfig: {
      schemas: scopeForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
    },
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerScopeTable, { reload: reloadScope }] = scopeTableContext;

function handleAddScope() {
  openScopeModal(true, { type: 'add' });
}
function handleEditScope(record) {
  openScopeModal(true, { type: 'edit', row: record });
}
function handleViewScope(record) {
  openScopeModal(true, { type: 'view', row: record });
}
async function handleDeleteScope(record) {
  await deleteScope({ id: record.id }, reloadScope);
}
function getScopeTableAction(record) {
  return [
    { label: '查看', onClick: handleViewScope.bind(null, record) },
    { label: '编辑', onClick: handleEditScope.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteScope.bind(null, record) },
    },
  ];
}

// ----- 警示标识设置情况表格 -----
const [registerSignModal, { openModal: openSignModal }] = useModal();
const { tableContext: signTableContext } = useListPage({
  designScope: 'sign',
  tableProps: {
    api: listSignPage,
    columns: signColumns,
    formConfig: {
      schemas: identificationNameForm,
      labelWidth: 100,
      rowProps: { gutter: 24 },
      actionColOptions: { span: 4 },
    },
    showIndexColumn: true,
    actionColumn: { width: 200, fixed: 'right' },
  },
});
const [registerSignTable, { reload: reloadSign }] = signTableContext;

function handleAddSign() {
  openSignModal(true, { type: 'add' });
}
function handleEditSign(record) {
  openSignModal(true, { type: 'edit', row: record });
}
function handleViewSign(record) {
  openSignModal(true, { type: 'view', row: record });
}
async function handleDeleteSign(record) {
  await deleteSign({ id: record.id }, reloadSign);
}
function getSignTableAction(record) {
  return [
    { label: '查看', onClick: handleViewSign.bind(null, record) },
    { label: '编辑', onClick: handleEditSign.bind(null, record) },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDeleteSign.bind(null, record) },
    },
  ];
}

// Tab切换处理（可选，如果需要根据tab重置搜索等）
function handleMainTabChange(key) {
  // 可根据需要重置参数
}
function handleProtectTabChange(key) { }
function handleDailyTabChange(key) { }
</script>

<style lang="less" scoped>
.search-wrapper {
  margin-bottom: 16px;
  padding: 20px;
  margin: 0 20px;
  border-radius: 4px;
  background-color: #0b1c36;
}

:deep(.ant-tabs-nav-wrap) {
  padding: 0 40px !important;
}

/* 查询条件左对齐样式设置 */
.jeecg-online-search :deep(.ant-form-item-label) {
  flex: 0 0 auto !important;
  width: auto;
}

.jeecg-online-search :deep(.ant-form-item-control) {
  max-width: 100%;
}

/* label显示宽度 超出显示... */
.jeecg-online-search :deep(.label-text) {
  max-width: v-bind(labelTextMaxWidth);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
}
</style>