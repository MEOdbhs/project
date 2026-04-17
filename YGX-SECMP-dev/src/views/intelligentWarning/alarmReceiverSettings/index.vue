<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" v-auth="'system:configuration:add'" preIcon="ant-design:plus-outlined" @click="handleAdd">
        新增
      </a-button>
      <a-button type="primary" v-auth="'system:configuration:add'" @click="handleManageReceiver">
        管理接收人
      </a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <AddOrEditData @register="registerModal" @success="reload" />
  <ReceiverManageModal @register="registerReceiverModal" @success="reload" />
</template>

<script name="commitment-announcement" lang="ts" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import AddOrEditData from './components/AddOrEditData.vue';
  import ReceiverManageModal from './components/ReceiverManageModal.vue';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './line.data';
  import { listPage, deleteItem } from './line.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();
  const [registerReceiverModal, { openModal: openReceiverModal }] = useModal();

  const { tableContext } = useListPage({
    designScope: 'chemicals-dangerous-template',
    tableProps: {
      title: '配置管理',
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
    await deleteItem({ id: record.id }, reload);
  }

  // 管理接收人（顶部按钮）
  function handleManageReceiver() {
    openReceiverModal(true);
  }

  function getTableAction(record) {
    return [
      {
        label: '编辑',
        auth: 'system:configuration:edit',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        auth: 'system:configuration:delete',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>