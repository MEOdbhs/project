<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button v-auth="'inventoryPlan:add'" type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
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
      title: '盘点计划',
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
        auth: 'inventoryPlan:view',
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'inventoryPlan:edit',
      },
      {
        label: '删除',
        auth: 'inventoryPlan:delete',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>
