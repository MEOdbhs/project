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

    <AddOrEditData @register="registerModal" @success="reload" />
    <SimulationTestModal @register="registerSimulationModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './components/AddOrEditData.vue';
import SimulationTestModal from './components/SimulationTestModal.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, deleteItem, getTabList } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';

const [registerModal, { openModal }] = useModal();
const [registerSimulationModal, { openModal: openSimulationModal }] = useModal();

// Tab 列表数据
const tabList = ref([]);
const activeTabKey = ref('');

// 获取 Tab 列表（从字典接口获取）
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
  designScope: 'rule-config',
  tableProps: {
    title: '规则配置',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    // 动态传递当前 tab 对应的设备类型参数
    beforeFetch: async (params) => {
      params.monitorCategoryId = activeTabKey.value;
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
 * 新增
 */
function handleAdd() {
  openModal(true, { type: 'add', row: null, deviceType: activeTabKey.value });
}

/**
 * 查看
 */
function handleView(record) {
  openModal(true, { type: 'view', row: record, deviceType: activeTabKey.value });
}

/**
 * 编辑
 */
function handleEdit(record) {
  openModal(true, { type: 'edit', row: record, deviceType: activeTabKey.value });
}

/**
 * 删除
 */
async function handleDelete(record) {
  await deleteItem({ id: record.id }, reload);
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    { label: '查看', onClick: handleView.bind(null, record) },
    { label: '编辑', onClick: handleEdit.bind(null, record) },
  ];
}
</script>