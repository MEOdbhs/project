<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script name="fundraising-supplier-manage" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import AddOrEditData from './components/AddOrEditData.vue';
import { columns, searchFormSchema } from './line.data';
import { deleteItem, listPage } from './line.api';

const [registerModal, { openModal }] = useModal();

const { tableContext } = useListPage({
  designScope: 'fundraising-supplier-manage-template',
  tableProps: {
    title: '供应商管理',
    api: listPage,
    columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 180,
      fixed: 'right',
    },
  },
});

const [registerTable, { reload }] = tableContext;

function handleAdd() {
  openModal(true, { type: 'add', row: null });
}

function handleEdit(record) {
  openModal(true, { type: 'edit', row: record });
}

function handleView(record) {
  openModal(true, { type: 'view', row: record });
}

async function handleDelete(record) {
  await deleteItem(record.id, reload);
}

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

