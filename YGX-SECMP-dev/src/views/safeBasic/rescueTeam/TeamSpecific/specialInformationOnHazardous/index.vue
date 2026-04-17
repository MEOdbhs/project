<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" v-auth="'system:configuration:add'" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <AddOrEditData @register="registerModal" @success="reload" />
</template>

<script name="commitment-announcement" lang="ts" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './line.data';
  import { listPage, deleteItem } from './line.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext, onExportXls  } = useListPage({
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

 
  /**
   * 新增
   */
  function handleAdd() {
    openModal(true, { type: 'add', row: null });
  }
  /**
   * 查看
   */
  function handleView(record) {
    openModal(true, { type: 'view', row: record });
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
    await deleteItem({'id':record.id}, reload);
  }
  /**
   * 操作栏
   */
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
