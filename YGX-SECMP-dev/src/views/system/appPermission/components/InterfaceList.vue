<!-- 接口清单 -->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditInterfaceData @register="registerModal" @success="reload" />
</template>
<script name="system-appPermission-interfaceList" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import AddOrEditInterfaceData from './AddOrEditInterfaceData.vue';
  import { useModal } from '/@/components/Modal';
  import { columnsInterface, searchFormSchemaInterface } from '../appPermission.data';
  import { listInterface, deleteInterface } from '../appPermission.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'appPermission-interfaceList-template',
    tableProps: {
      title: '接口清单列表',
      api: listInterface,
      columns: columnsInterface,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 65,
        rowProps: { gutter: 24 },
        schemas: searchFormSchemaInterface,
      },
      actionColumn: {
        width: 120,
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
    await deleteInterface(record.id, reload);
  }
  /**
   * 查看
   */
  function handleView(record) {
    openModal(true, { type: 'view', row: record });
  }
  /**
   * 操作栏
   */
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
