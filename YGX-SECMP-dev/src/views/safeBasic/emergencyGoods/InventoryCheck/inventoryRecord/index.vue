<template>
  <BasicTable @register="registerTable">
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
import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
const userInfo = userStore.userInfo;
  defineOptions({
    name: 'InventoryPlanManage',
  });

  const [registerModal, { openModal }] = useModal();

  const { tableContext } = useListPage({
    designScope: 'inventory-plan-manage-template',
    tableProps: {
      title: '',
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

  function handleApply(record) {
    openModal(true, { type: 'apply', row: record });
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
        auth: 'inventoryRecord:view',
      },
      {
        label: '盘点',
        onClick: handleEdit.bind(null, record),
        auth: 'inventoryRecord:pandian',
        disabled: record.inventoryStatus == 1 ||  !(record.inventoryUserId || '').split(',').map(s => s.trim()).includes(String(userInfo.id)),
      },
      {
        label: '审核',
        onClick: handleApply.bind(null, record),
        auth: 'inventoryRecord:review',
        disabled: record.reviewStatus == 1 || record.inventoryStatus != 1,
      },
    ];
  }
</script>
