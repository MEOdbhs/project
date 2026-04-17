<template>
  <BasicTable :ellipsis="true" @register="registerTable" :searchInfo="searchInfo" :columns="operationLogColumn"
    :expand-column-width="16">
    <template #tableTitle>
      <a-button v-auth="'monitor:networkManagement:config'" @click="handleAdd" class="mr-2" type="primary">配置</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  
  <!-- 配置弹窗 -->
  <AlarmConfigModal @register="registerModal" @success="handleConfigSuccess" />
</template>

<script name="alarm-info-table" setup lang="ts">
import { BasicTable, TableAction } from '/@/components/Table';
import { getListAlarmInfo } from '../network.api';
import { AlarmInfoTableColumns, operationLogColumn } from '../network.data';
import { useListPage } from '/@/hooks/system/useListPage';
import AlarmConfigModal from './AlarmConfigModal.vue';
import { useModal } from '/@/components/Modal';
import { useUserStore } from '/@/store/modules/user'
import { message } from 'ant-design-vue';
const userStore = useUserStore()

interface Props {
  searchInfo: any;
}

withDefaults(defineProps<Props>(), {
  searchInfo: () => ({})
});

// 注册配置弹窗
const [registerModal, { openModal }] = useModal();

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'alarm-info',
  tableProps: {
    api: getListAlarmInfo,
    expandRowByClick: true,
    showActionColumn: false,
    actionColumn: {
      width: 0,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    rowSelection: {
      columnWidth: 20,
    },
    beforeFetch: (params) => {
      params.orgCode = userStore.currentEnterpriseCode
      return params
    },
    formConfig: {
      labelWidth: 100,
      schemas: AlarmInfoTableColumns,
      fieldMapToTime: [['fieldTime', ['alarmStartDate', 'alarmEndDate'], 'YYYY-MM-DD HH:mm']],
    },
  },
});

const [registerTable, tableActions] = tableContext;
const { reload, getDataSource } = tableActions;

/**
 * 统一抽取设备配置
 */
function normalizeDeviceConfigs(list: any[] = []) {
  const configMap = new Map<string | number, any>();
  list.forEach((item: any) => {
    const typeId = item?.deviceTypeId ?? item?.deviceType;
    if (!typeId || configMap.has(typeId)) {
      return;
    }
    configMap.set(typeId, {
      id: item.id,
      deviceTypeId: typeId,
      thresholdUpper: item.thresholdUpper,
      thresholdLower: item.thresholdLower,
    });
  });
  return Array.from(configMap.values());
}

/**
 * 获取当前列表已配置的设备阈值，用于弹窗回显
 */
function getConfiguredDeviceTypesFromTable() {
  if (!getDataSource) return [];
  const dataSource = getDataSource() || [];
  return normalizeDeviceConfigs(dataSource);
}

/**
 * 获取所有已配置的设备阈值（不分页）
 */
async function getAllConfiguredDeviceTypes() {
  try {
    const params: Record<string, any> = {
      pageNo: 1,
      pageSize: 9999,
      orgCode: userStore.currentEnterpriseCode,
    };
    const res: any = await getListAlarmInfo(params);
    const possibleLists = [
      res?.records,
      res?.result?.records,
      res?.data?.records,
      res?.data,
      res,
    ];

    const list =
      possibleLists.find((item) => Array.isArray(item)) || [];
    return normalizeDeviceConfigs(list as any[]);
  } catch (error) {
    console.error('获取全部告警配置失败', error);
    message.error('获取全部配置失败，已使用当前列表数据');
    return getConfiguredDeviceTypesFromTable();
  }
}

/**
 * 新增 - 打开配置弹窗
 */
async function handleAdd() {
  const configs = await getAllConfiguredDeviceTypes();
  console.log(configs,'configs');
  
  openModal(true, {
    configs,
  });
}

/**
 * 配置成功回调
 */
function handleConfigSuccess() {
  reload();
}

/**
 * 查看
 */
function handleView(record) {
  console.log(record, '查看');
}

/**
* 编辑
*/
function handleEdit(record) {
  console.log('编辑', record);
}

/**
* 操作栏
*/
function getTableAction(record) {
  return [
    {
      label: '查看',
      onClick: handleView.bind(null, record),
    },
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
    },
  ];
}

// 暴露reload方法供父组件调用
defineExpose({
  reload
});
</script>
