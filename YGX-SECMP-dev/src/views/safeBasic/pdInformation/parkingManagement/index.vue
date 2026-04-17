<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" v-auth="'safeBasic:pdInformation:parkingManagement:add'" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
      <a-button v-auth="'safeBasic:pdInformation:parkingManagement:export'" @click="onExportXls" class="mr-2" type="primary" preIcon="ant-design:export-outlined">导出</a-button>

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
  import { listPage, deleteItem, getExportUrl } from './line.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()

  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext, onExportXls  } = useListPage({
    designScope: 'chemicals-dangerous-template',
    tableProps: {
      title: '开停车管理',
      api: listPage,
      columns: columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 80,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
      },
      beforeFetch: (params) => {
      params.orgCode = userStore.currentEnterpriseCode
      return params
    },
      actionColumn: {
        width: 200,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '开停车管理',
      url: getExportUrl,
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
    console.log(record,'1111111');
    
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
    await deleteItem(record.id, reload);
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '查看',
        auth: 'safeBasic:pdInformation:parkingManagement:view',
        onClick: handleView.bind(null, record),
      },
      {
        label: '编辑',
        auth: 'safeBasic:pdInformation:parkingManagement:edit',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        auth: 'safeBasic:pdInformation:parkingManagement:del',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
      
    ];
  }
</script>
