<template>
  <BasicTable @register="registerTable">
    <template #tableTitle> </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { columns, searchFormSchema } from './line.data';
  import { deleteItem, listPage } from './line.api';

  defineOptions({
    name: 'InventoryPlanManage',
  });

  const [registerModal, { openModal }] = useModal();

  const { tableContext } = useListPage({
    designScope: 'inventory-plan-manage-template',
    tableProps: {
      title: '盘点计划',
      api: listPage,
      columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 96,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
        fieldMapToTime: [
          ['planTimeRange', ['remindBeginDt', 'remindEndDt'], 'YYYY-MM-DD'],
          ['handleTimeRange', ['handleBeginDt', 'handleEndDt'], 'YYYY-MM-DD'],
        ],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
  });

  const [registerTable, { reload }] = tableContext;

  function handleEdit(record) {
    openModal(true, { type: 'edit', row: record });
  }
  function handleView(record) {
    openModal(true, { type: 'view', row: record });
  }

  function getTableAction(record) {
    return [
      {
        label: '查看',
        onClick: handleView.bind(null, record),
        auth: 'single:view',
      },
      {
        label: '处理',
        onClick: handleEdit.bind(null, record),
        auth: 'single:edit',
        disabled: record.handleStatusName != '待处理',
      },
    ];
  }
</script>
