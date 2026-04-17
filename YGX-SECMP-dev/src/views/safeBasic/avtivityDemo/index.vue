<!-- 奖惩管理 -->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
      <a-button @click="onExportXls" class="mr-2" type="primary" preIcon="ant-design:export-outlined">导出</a-button>

    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
  <TimeLineModal @register="registerTimeLineModal" />
</template>
<script name="driver-reward-punish" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './components/AddOrEditData.vue';
import TimeLineModal from '/@/components/TimeLine/index.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, deleteItem, getExportUrl } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';
const [registerModal, { openModal }] = useModal();
const [registerTimeLineModal, { openModal: openTimeLineModal }] = useModal();

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'reward-punish-template',
  tableProps: {
    title: '奖惩信息',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 65,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 190,
      fixed: 'right',
    },
  },
  exportConfig: {
    name: '司机奖惩管理',
    url: getExportUrl,
  },
});
const [registerTable, { reload }] = tableContext;

/**
 * 新增
 */
function handleAdd() {
  openModal(true, { type: 'add', row: null });
}
/**
 * 编辑
 */
function handleEdit(record) {
  openModal(true, { type: 'edit', row: record });
}
/**
 * 提交
 */
function handleSubmit(record) {
  openModal(true, { type: 'submit', row: record });
}
/**
 * 审核
 */
function handleAudit(record) {
  openModal(true, { type: 'audit', row: record });
}
/**
 * 流程进度
 */
function handleTimeLine(record) {
  openTimeLineModal(true, { businessId: record.id });
}
/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteItem(record.id, reload);
}
/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
      auth: 'driver-rp-edit',
      ifShow: (action) => record.examStatus == 1,
    },
    {
      label: '提交',
      onClick: handleSubmit.bind(null, record),
      auth: 'driver-rp-submit',
      ifShow: (action) => (!record.examStatus||record.examStatus==1),
    },
    {
      label: '审核',
      onClick: handleAudit.bind(null, record),
      auth: 'driver-rp-audit',
      ifShow: (action) => record.examBtn,
    },
    {
      label: '流程进度',
      onClick: handleTimeLine.bind(null, record),
      ifShow: (action) => record.examStatusText&&record.examStatusText!='待提交', // 非草稿状态才显示流程进度
    },
    {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
      },
      ifShow: (action) => record.examStatus == 1,
      auth: 'driver-rp-delete',
    },
  ];
}
</script>
