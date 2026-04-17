<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" v-auth="'system:calibration:add'" preIcon="ant-design:plus-outlined" @click="handleAdd">
        新增
      </a-button>
    </template>

    <!-- 自定义状态列渲染为开关 -->
    <template #state="{ column, record }">
      <template v-if="column.dataIndex === 'state'">
        <a-switch :disabled="!record.id" :checked="record.state === 'Y'"
          @change="(checked) => handleStatusChange(record, checked)" />
      </template>
    </template>

    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script name="device-calibration" lang="ts" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './components/AddOrEditData.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, deleteItem, updateStatus } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';
import { message } from 'ant-design-vue';

const [registerModal, { openModal }] = useModal();

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'device-calibration',
  tableProps: {
    title: '设备校准计划',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 120,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
      fieldMapToTime: [['createTime', ['startCreateDate', 'endCreateDate'], 'YYYY-MM-DD'], ['rangTime', ['startPlan', 'endPlan'], 'YYYY-MM-DD']],
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 状态切换处理
 */
const handleStatusChange = async (record, checked) => {
  const newState = checked ? 'Y' : 'N';
  try {
    await updateStatus({ id: record.id, state: newState });
    message.success('状态更新成功');
    reload();
  } catch (error) {
    message.error(error.message || '状态更新失败');
  }
};

/**
 * 查看
 */
function handleView(record) {
  openModal(true, { type: 'view', row: record });
}

/**
 * 编辑
 */
function handleEdit(record) {
  openModal(true, { type: 'edit', row: record });
}

/**
 * 操作栏按钮配置
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
      // 当系统时间 >= 计划开始时间 且 状态为 Y 时，隐藏编辑按钮
      ifShow: () => {
        const now = new Date();
        const startTime = record.startPlan ? new Date(record.startPlan) : null;
        // 如果没有开始时间或状态不是 Y，则显示编辑按钮
        if (!startTime || record.state !== 'Y') {
          return true;
        }
        // 如果当前时间小于开始时间，显示；否则（≥）隐藏
        return now < startTime;
      }
    },
  ];
}
</script>