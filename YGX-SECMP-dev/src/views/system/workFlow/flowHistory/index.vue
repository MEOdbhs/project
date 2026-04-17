<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <HistoryList @register="registerModal" />
  <LetList @register="registerModal2" />
</template>
<script name="system-workFlow-flowHistory" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './flowHistory.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listPage } from './flowHistory.api';

  import HistoryList from './components/HistoryList.vue';
  import LetList from './components/LetList.vue';
  import { onMounted, onUnmounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'listPage-template',
    tableProps: {
      title: '流程历史列表',
      api: listPage,
      columns: columns,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 65,
        rowProps: { gutter: 24 },
        schemas: searchFormSchema,
        autoAdvancedCol: 6,
      },
      actionColumn: {
        width: 120,
      },
      rowSelection: null,
      beforeFetch: (params) => {
        if (!params.bussinesskey) {
          params.bussinesskey = '';
        }
        if (!params.name) {
          params.name = '';
        }
      },
    },
  });
  const [registerTable, { reload }] = tableContext;
  // 注册 modal
  const [registerModal, { openModal }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();

  const handleViewHistory = (record) => {
    openModal(true, {
      row: record,
    });
  };
  const handleViewLet = (record) => {
    openModal2(true, {
      row: record,
    });
  };

  function getTableAction(record) {
    return [
      {
        label: '查看历史',
        onClick: handleViewHistory.bind(null, record),
      },
      {
        label: '查看变量',
        onClick: handleViewLet.bind(null, record),
      },
    ];
  }
  onMounted(() => {});
  onUnmounted(() => {});
</script>
<style scoped lang="less"></style>
