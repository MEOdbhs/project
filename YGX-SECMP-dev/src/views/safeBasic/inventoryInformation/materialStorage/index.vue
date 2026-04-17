<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" v-auth="['materialStorage:add']" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script setup lang="ts" name="material-storage">
  import type { ActionItem } from '/@/components/Table';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { message } from 'ant-design-vue';
  import { listPage, deleteById } from './materialStorage.api';
  import { columns, searchFormSchema } from './materialStorage.data';

  const { tableContext } = useListPage({
    designScope: 'material-storage-template',
    tableProps: {
      title: '仓储物资信息',
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
  });

  const [registerTable, { reload }] = tableContext;
  const [registerModal, { openModal }] = useModal();

  function handleAdd() {
    openModal(true, { type: 'add', row: null });
  }

  function handleView(record): ActionItem {
    openModal(true, { type: 'view', row: record });
    return record;
  }

  function handleEdit(record): ActionItem {
    openModal(true, { type: 'edit', row: record });
    return record;
  }

  function handleDelete(record): void {
    deleteById({ id: record.id }).then(() => {
      message.success('删除成功');
      reload();
    });
  }

  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '查看',
        auth: 'materialStorage:view',
        onClick: () => handleView(record),
      },
      {
        label: '编辑',
        auth: 'materialStorage:edit',
        onClick: () => handleEdit(record),
      },
      {
        label: '删除',
        auth: 'materialStorage:delete',
        popConfirm: {
          title: '是否确认删除？',
          confirm: () => handleDelete(record),
        },
      },
    ];
  }
</script>

<style scoped lang="less"></style>