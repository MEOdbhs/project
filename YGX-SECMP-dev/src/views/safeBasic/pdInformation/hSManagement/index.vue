<!-- 危险源管理 -->
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
</template>
<script name="hazard-manage" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './components/AddOrEditData.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, deleteItem, getExportUrl } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';
const [registerModal, { openModal }] = useModal();

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'hazard-manage-template',
  tableProps: {
    title: '危险源信息',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 150,
      fixed: 'right',
    },
  },
  exportConfig: {
    name: '危险源管理',
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
 * 查看
 */
function handleView(record) {
  openModal(true, { type: 'view', row: record });
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
      label: '查看',
      onClick: handleView.bind(null, record),
    },
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
    },
    {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
      },
    },
  ];
}
</script>
