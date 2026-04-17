<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" v-auth="['donationInformation:add']" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script setup lang="ts" name="donation-information">
  import type { ActionItem } from '/@/components/Table';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from './donationInformation.data';
  import { listPage, deleteById } from './donationInformation.api';

  const { tableContext } = useListPage({
    designScope: 'donation-information-template',
    tableProps: {
      title: '捐赠信息',
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
        fieldMapToTime: [['donationDateRange', ['startDate', 'endDate'], 'YYYY-MM-DD HH:mm:ss']],
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
        auth: 'donationInformation:view',
        onClick: () => handleView(record),
      },
      {
        label: '编辑',
        auth: 'donationInformation:edit',
        onClick: () => handleEdit(record),
      },
      {
        label: '删除',
        auth: 'donationInformation:delete',
        popConfirm: {
          title: '是否确认删除？',
          confirm: () => handleDelete(record),
        },
      },
    ];
  }
</script>

<style scoped lang="less"></style>