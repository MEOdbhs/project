<template>
  <div class="realtime-monitoring">
    <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
      <!-- 矿山 -->
      <a-tab-pane key="mine" tab="矿山">
        <div class="tab-content">
          <BasicTable @register="registerMineTable">
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'mine')" />
            </template>
          </BasicTable>
        </div>
      </a-tab-pane>

      <!-- 地质灾害 -->
      <a-tab-pane key="geology" tab="地质灾害">
        <div class="tab-content">
          <div class="toolbar">
            <a-radio-group v-model:value="geologyDeviceType" button-style="solid" @change="handleGeologyDeviceChange">
              <a-radio-button value="sensor">传感器</a-radio-button>
              <a-radio-button value="video">视频监控</a-radio-button>
            </a-radio-group>
          </div>
          <BasicTable @register="registerGeologyTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'onlineStatus'">
                <a-tag :color="record.onlineStatus === 'Y' ? 'green' : 'red'">
                  {{ record.onlineStatus === 'Y' ? '在线' : '离线' }}
                </a-tag>
              </template>
            </template>
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'geology')" />
            </template>
          </BasicTable>
        </div>
      </a-tab-pane>

      <!-- 水文 -->
      <a-tab-pane key="hydrology" tab="水文">
        <div class="tab-content">
          <div class="toolbar">
            <a-radio-group v-model:value="hydrologyDeviceType" button-style="solid"
              @change="handleHydrologyDeviceChange">
              <a-radio-button value="sensor">传感器</a-radio-button>
              <a-radio-button value="video">视频监控</a-radio-button>
            </a-radio-group>
          </div>
          <BasicTable @register="registerHydrologyTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'onlineStatus'">
                <a-tag :color="record.onlineStatus === 'Y' ? 'green' : 'red'">
                  {{ record.onlineStatus === 'Y' ? '在线' : '离线' }}
                </a-tag>
              </template>
            </template>
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'hydrology')" />
            </template>
          </BasicTable>
        </div>
      </a-tab-pane>

      <!-- 工贸 -->
      <a-tab-pane key="industry" tab="工贸">
        <div class="tab-content">
          <BasicTable @register="registerIndustryTable">
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'industry')" />
            </template>
          </BasicTable>

        </div>
      </a-tab-pane>

      <!-- 危险化学品 -->
      <a-tab-pane key="chemical" tab="危险化学品">
        <div class="tab-content">
          <BasicTable @register="registerChemicalTable">
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'chemical')" />
            </template>
          </BasicTable>
        </div>
      </a-tab-pane>

      <!-- 森林防火 -->
      <a-tab-pane key="forest" tab="森林防火">
        <div class="tab-content">
          <div class="toolbar">
            <a-radio-group v-model:value="forestDeviceType" button-style="solid" @change="handleForestDeviceChange">
              <a-radio-button value="sensor">传感器</a-radio-button>
              <a-radio-button value="video">视频监控</a-radio-button>
            </a-radio-group>
          </div>
          <BasicTable @register="registerForestTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'onlineStatus'">
                <a-tag :color="record.onlineStatus === 'Y' ? 'green' : 'red'">
                  {{ record.onlineStatus === 'Y' ? '在线' : '离线' }}
                </a-tag>
              </template>

            </template>
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record,'forest')" />
            </template>
          </BasicTable>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { listPage, listSensingPage } from './line.api';
import {
  getIndustryColumns,
  mineSearchSchema,
  industrySearchSchema,
  chemicalSearchSchema,
  geologySearchSchema,
  sensingSearchSchema,
  geologySensorColumns,
  geologyVideoColumns,
  hydrologySensorColumns,
  hydrologyVideoColumns,
  forestSensorColumns,
  forestVideoColumns,
} from './line.data';
import { useRouter } from 'vue-router';

const router = useRouter();
// ========== 矿山 ==========
const { tableContext: mineTableContext } = useListPage({
  designScope: 'realtime-mine',
  tableProps: {
    title: '矿山监测',
    api: listPage,
    columns: getIndustryColumns('mine'),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: mineSearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      bigType: 'monitor_category_mining',   // 固定值
    }),
  },
});
const [registerMineTable, { reload: reloadMine }] = mineTableContext;

// ========== 工贸 ==========
const { tableContext: industryTableContext } = useListPage({
  designScope: 'realtime-industry',
  tableProps: {
    title: '工贸监测',
    api: listPage,
    columns: getIndustryColumns('industry'),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: industrySearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      bigType: 'monitor_category_industry', // 固定值
    }),
  },
});
const [registerIndustryTable, { reload: reloadIndustry }] = industryTableContext;

// ========== 危险化学品 ==========
const { tableContext: chemicalTableContext } = useListPage({
  designScope: 'realtime-chemical',
  tableProps: {
    title: '危险化学品监测',
    api: listPage,
    columns: getIndustryColumns('chemical'),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: chemicalSearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      bigType: 'monitor_category_hazchem', // 固定值
    }),
  },
});
const [registerChemicalTable, { reload: reloadChemical }] = chemicalTableContext;

// ========== 地质灾害 ==========
const geologyDeviceType = ref<'sensor' | 'video'>('sensor');
const getGeologyColumns = () => geologyDeviceType.value === 'sensor' ? geologySensorColumns : geologyVideoColumns;
const { tableContext: geologyTableContext } = useListPage({
  designScope: 'realtime-geology',
  tableProps: {
    title: '地质灾害监测',
    api: listSensingPage,
    columns: getGeologyColumns(),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: geologySearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      associatedDeviceId: geologyDeviceType.value === 'sensor' ? '1' : '2',
      bigType: 'monitor_category_hazchem', // 固定值
    }),
  },
});
const [registerGeologyTable, { reload: reloadGeology, setProps: setGeologyProps }] = geologyTableContext;
const handleGeologyDeviceChange = () => {
  setGeologyProps({ columns: getGeologyColumns() });
  reloadGeology();
};

// ========== 水文 ==========
const hydrologyDeviceType = ref<'sensor' | 'video'>('sensor');
const getHydrologyColumns = () => hydrologyDeviceType.value === 'sensor' ? hydrologySensorColumns : hydrologyVideoColumns;
const { tableContext: hydrologyTableContext } = useListPage({
  designScope: 'realtime-hydrology',
  tableProps: {
    title: '水文监测',
    api: listSensingPage,
    columns: getHydrologyColumns(),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: sensingSearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      associatedDeviceId: hydrologyDeviceType.value === 'sensor' ? '1' : '2',
      bigType: 'monitor_category_hydrology', // 固定值
    }),
  },
});
const [registerHydrologyTable, { reload: reloadHydrology, setProps: setHydrologyProps }] = hydrologyTableContext;
const handleHydrologyDeviceChange = () => {
  setHydrologyProps({ columns: getHydrologyColumns() });
  reloadHydrology();
};

// ========== 森林防火 ==========
const forestDeviceType = ref<'sensor' | 'video'>('sensor');
const getForestColumns = () => forestDeviceType.value === 'sensor' ? forestSensorColumns : forestVideoColumns;
const { tableContext: forestTableContext } = useListPage({
  designScope: 'realtime-forest',
  tableProps: {
    title: '森林防火监测',
    api: listSensingPage,
    columns: getForestColumns(),
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: sensingSearchSchema,
    },
    actionColumn: { width: 80, fixed: 'right' },
    beforeFetch: (params) => ({
      ...params,
      associatedDeviceId: forestDeviceType.value === 'sensor' ? '1' : '2',
      bigType: 'monitor_category_fire', // 固定值
    }),
  },
});
const [registerForestTable, { reload: reloadForest, setProps: setForestProps }] = forestTableContext;
const handleForestDeviceChange = () => {
  setForestProps({ columns: getForestColumns() });
  reloadForest();
};

// 全局查看操作
const handleView = (record: any) => {
  router.push({
    path: 'realTimeMonitoring/realTimeMonitoringDetailPage', // 需在路由中注册
    query: {
      realtimeMonitoringId: record.id,
      bigType: activeTab.value === 'mine' ? 'monitor_category_mining' : activeTab.value === 'industry' ? 'monitor_category_industry' : activeTab.value === 'chemical' ? 'monitor_category_hazchem' : activeTab.value === 'geology' ? 'monitor_category_hazchem' : activeTab.value === 'hydrology' ? 'monitor_category' : activeTab.value === 'forest' ? 'monitor_category_fire' : '',
      companyName: record.companyName,
    },
  });
};
const handleViewOriginal = (record: any) => {
};
// ---------- 操作列 ----------
function getTableAction(record: any, tabKey: string) {
  if (tabKey === 'mine' || tabKey === 'industry' || tabKey === 'chemical') {
    console.log('tabKey', tabKey);
    return [
      {
        label: '查看',
        onClick: () => handleView(record),
      },
    ];
  } else {
    // 地质灾害、水文、森林防火 暂时使用原来的查看（弹窗）
    return [
      {
        label: '查看',
        onClick: () => handleViewOriginal(record),
      },
    ];
  }
}
// Tab 切换时刷新当前表格
const activeTab = ref('mine');
const handleTabChange = (key: string) => {
  if (key === 'mine') reloadMine();
  else if (key === 'industry') reloadIndustry();
  else if (key === 'chemical') reloadChemical();
  else if (key === 'geology') reloadGeology();
  else if (key === 'hydrology') reloadHydrology();
  else if (key === 'forest') reloadForest();
};
</script>

<style lang="less" scoped>
.realtime-monitoring {
  padding: 20px;
  min-height: 100%;

  .tab-content {
    background: rgb(11, 28, 54);

    .toolbar {
      margin-bottom: 4px;
      margin-left: 6px;
    }
  }
}
</style>