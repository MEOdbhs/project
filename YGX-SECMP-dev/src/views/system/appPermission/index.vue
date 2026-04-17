<!-- 应用管理 -->
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
  <InterfaceModal @register="registerInterfaceModal" @success="reload" />
</template>
<script name="system-appPermission" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import AddOrEditData from './components/AddOrEditData.vue';
  import InterfaceModal from './components/InterfaceModal.vue';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './appPermission.data';
  import { list, deleteApp } from './appPermission.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();
  const [registerInterfaceModal, { openModal: openInterfaceModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'appPermission-template',
    tableProps: {
      title: '应用列表',
      api: list,
      columns: columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 65,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
      },
      actionColumn: {
        width: 120,
      },
      //自定义默认排序
      defSort: {
        column: 'id',
        order: 'desc',
      },
    },
  });
  const [registerTable, { reload }] = tableContext;

  /**
   * 新增
   */
  function handleAdd() {
    openModal(true, { type: 'add', row: null });
  }
  /**
   * 编辑
   */
  function handleEdit(record) {
    openModal(true, { type: 'edit', row: record });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteApp(record.id, reload);
  }
  /**
   * 接口授权
   */
  function handlePerssion(record) {
    openInterfaceModal(true, { row: record });
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '接口授权',
        onClick: handlePerssion.bind(null, record),
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
