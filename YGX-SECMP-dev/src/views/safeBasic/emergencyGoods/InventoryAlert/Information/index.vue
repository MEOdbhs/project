<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>

    </template>
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
      title: '预警信息',
      api: listPage,
      columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 96,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
        fieldMapToTime: [['planTimeRange', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
      },
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
    },
  });

  const [registerTable, { reload }] = tableContext;

  function handleEdit(record) {
    openModal(true, { type: 'edit', row: record });
  }

  async function handleDelete(record) {
    await deleteItem(record.id, reload);
  }

  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'Information:edit',
      },
    ];
  }
</script>
