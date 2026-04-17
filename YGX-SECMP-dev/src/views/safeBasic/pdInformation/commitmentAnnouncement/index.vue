<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <!--  -->
      <a-button type="primary" v-auth="'safeBasic:notice:add'"  preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
      <a-button v-auth="'safeBasic:notice:export'" @click="onExportXls" class="mr-2" type="primary" preIcon="ant-design:export-outlined">导出</a-button>

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
      title: '安全生产承诺公告',
      api: listPage,
      columns: columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 100,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
        fieldMapToTime: [['releaseTimeRange', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
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
        name: '安全生产承诺公告',
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
        auth: 'safeBasic:notice:view',
        onClick: handleView.bind(null, record),
      },
      {
        label: '编辑',
        auth: 'safeBasic:notice:editor',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        auth: 'safeBasic:notice:del',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
      
    ];
  }
</script>
