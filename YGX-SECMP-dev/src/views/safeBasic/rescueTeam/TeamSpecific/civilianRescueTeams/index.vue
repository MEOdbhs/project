<!-- 民间救援队伍管理 -->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
      <!-- <a-button @click="onExportXls" class="mr-2" type="primary" preIcon="ant-design:export-outlined" v-auth="'rescue-civil:export'">导出</a-button> -->
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script setup lang="ts" name="rescue-civil">
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './components/AddOrEditData.vue';
import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './line.data';
import { listPage, deleteItem, getExportUrl } from './line.api';
import { useListPage } from '/@/hooks/system/useListPage';

const [registerModal, { openModal }] = useModal();

const { tableContext, onExportXls } = useListPage({
  designScope: 'rescue-civil',
  tableProps: {
    title: '民间救援队伍',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
  },
  exportConfig: {
    name: '民间救援队伍',
    url: getExportUrl,
  },
});

const [registerTable, { reload }] = tableContext;

function handleAdd() {
  openModal(true, { type: 'add', row: null });
}
function handleView(record) {
  openModal(true, { type: 'view', row: record });
}
function handleEdit(record) {
  openModal(true, { type: 'edit', row: record });
}
async function handleDelete(record) {
  await deleteItem(record.id, reload);
}
function getTableAction(record) {
  return [
    { label: '查看', onClick: handleView.bind(null, record), },
    { label: '编辑', onClick: handleEdit.bind(null, record), },
    {
      label: '删除',
      popConfirm: { title: '是否确认删除', confirm: handleDelete.bind(null, record) },
      auth: 'rescue-civil:delete',
    },
  ];
}
</script>