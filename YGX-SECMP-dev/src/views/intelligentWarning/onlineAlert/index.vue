<template>
  <div>
    <!-- 动态 Tab 页签 -->
    <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value" :tab="item.label">
        <!-- 每个 Tab 下使用同一个表格组件 -->
        <BasicTable @register="registerTable">
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>
    </a-tabs>

    <!-- 处置弹窗 -->
    <DisposeModal @register="registerDisposeModal" @success="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import DisposeModal from './components/DisposeModal.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, getTabList, downById } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';

const [registerDisposeModal, { openModal: openDisposeModal }] = useModal();

// Tab 列表数据
const tabList = ref([]);
const activeTabKey = ref('');

// 获取 Tab 列表（从字典接口获取，例如字典码 'warning_tab_type'）
const fetchTabList = async () => {
  const res = await getTabList('/monitor_category');
  tabList.value = res || [];
  if (tabList.value.length > 0) {
    activeTabKey.value = tabList.value[0].value;
  }
};
fetchTabList();

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'online-warning',
  tableProps: {
    title: '在线监测预警',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 150,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
      fieldMapToTime: [['dateRange', ['startWarningTime', 'endWarningTime'], 'YYYY-MM-DD']],
    },
    actionColumn: {
      width: 190,
      fixed: 'right',
    },
    // 动态传递当前 tab 对应的类型参数
    beforeFetch: (params) => {
      params.type = activeTabKey.value; // 根据实际字段名调整
      return params;
    },
  },
});
const [registerTable, { reload }] = tableContext;

// Tab 切换时刷新表格
const handleTabChange = (key) => {
  activeTabKey.value = key;
  // reload();
};

/**
 * 查看
 */
function handleView(record) {
  openDisposeModal(true, { record, isView: true });
}
/**
 * 处置操作
 */
function handleDispose(record) {
  openDisposeModal(true, { record, isView: false });
}

/**
 * 确认闭警
 */
async function handleDelete(record) {
  await downById({ isDown: 'Y', id: record.id }, reload());
}

/**
 * 操作栏配置（只保留处置按钮）
 */
function getTableAction(record) {
  return [
    {
      label: '查看',
      onClick: handleView.bind(null, record),
    },
    {
      label: '处置',
      onClick: handleDispose.bind(null, record),
    },
    {
      label: '确认闭警',
      auth: 'onlineAlert:close',
      ifShow: () => record.disposalProgress == 'Y' &&  record.isDown !== 'Y',
      popConfirm: {
        title: '是否确认闭警',
        confirm: handleDelete.bind(null, record),
      },
    },
  ];
}
</script>
<style lang="less" scoped>

:deep(.ant-tabs-nav) {
      display: flex;
      align-items: center;
      .ant-btn-link {
        padding-left: 0;
      }
    }
</style>