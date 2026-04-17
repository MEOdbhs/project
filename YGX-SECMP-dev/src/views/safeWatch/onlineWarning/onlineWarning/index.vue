<!-- 危险化工工艺管理 -->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <!-- <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button> -->
      <a-button v-auth="'OnlineWarning-export'" @click="onExportXls" class="mr-2" type="primary" preIcon="ant-design:export-outlined">导出</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
</template>
<script name="chemical-process" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import AddOrEditData from './components/AddOrEditData.vue';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './line.data';
  import { listPage, getExportUrl } from './line.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
    designScope: 'chemical-process-template',
    tableProps: {
      title: '物联监测预警',
      api: listPage,
      columns: columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 120,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
        fieldMapToTime: [['alarmTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
      },
      actionColumn: {
        width: 200,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '物联监测预警',
      url: getExportUrl,
    },
  });
  const [registerTable, { reload }] = tableContext;

  /**
   * 查看
   */
  function handleView(record) {
    openModal(true, { type: 'view', record });
  }
  /**
   * 编辑
   */
  function handleEdit(record) {
    openModal(true, { type: 'edit', record });
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '查看',
        onClick: handleView.bind(null, record),
        auth: 'OnlineWarning-view',
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'OnlineWarning-edit',
      },
    ];
  }
</script>
