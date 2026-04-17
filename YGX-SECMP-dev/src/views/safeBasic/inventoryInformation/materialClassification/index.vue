<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" v-auth="['materialClassification:add']" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script setup lang="ts" name="material-classification">
  import type { ActionItem } from '/@/components/Table';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from './materialClassification.data';
  import { listPage, deleteById } from './materialClassification.api';

  const { tableContext } = useListPage({
    designScope: 'material-classification-template',
    tableProps: {
      title: '物料分类',
      api: listPage,
      columns,
      rowKey: 'id',
      showIndexColumn: true,
      actionColumn: {
        width: 200,
        fixed: 'right',
      },
      formConfig: {
        labelWidth: 120,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
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

  async function handleDelete(record): Promise<void> {
    await deleteById({ id: record.id });
    message.success('删除成功');
    reload();
  }

  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '查看',
        auth: 'materialClassification:view',
        onClick: () => handleView(record),
      },
      {
        label: '编辑',
        auth: 'materialClassification:edit',
        onClick: () => handleEdit(record),
      },
      {
        label: '删除',
        auth: 'materialClassification:delete',
        popConfirm: {
          title: '是否确认删除？',
          confirm: () => handleDelete(record),
        },
      },
    ];
  }
</script>

<style scoped lang="less"></style>