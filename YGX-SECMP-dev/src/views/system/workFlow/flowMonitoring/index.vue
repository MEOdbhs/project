<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <FlowImg @register="registerModal" />
</template>
<script name="system-workFlow-flowMonitoring" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './flowMonitoring.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listPage, run, suspend, traceProcess } from './flowMonitoring.api';
  import FlowImg from '../components/FlowImg.vue';
  import { onMounted, onUnmounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'listPage-template',
    tableProps: {
      title: '流程监控列表',
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

  const handleProcess = async (record) => {
    const res = await traceProcess(record.businessKey);
    if (res?.code === 500) {
      message.error(res?.msg);
      return;
    }
    const blob = new Blob([res.data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    openModal(true, {
      modelerUrl: url,
      title: '流程图片',
    });
  };
  const handleSuspend = async (record) => {
    await suspend(record.processInstanceId, reload);
  };
  const handleRun = async (record) => {
    await run(record.processInstanceId, reload);
  };
  function getTableAction(record) {
    return [
      {
        label: '进程进度',
        onClick: handleProcess.bind(null, record),
      },
      {
        label: '挂起',
        popConfirm: {
          title: '是否确认挂起',
          confirm: handleSuspend.bind(null, record),
        },
        ifShow: !record.suspended,
      },
      {
        label: '激活',
        popConfirm: {
          title: '是否确认激活',
          confirm: handleRun.bind(null, record),
        },
        ifShow: record.suspended,
      },
    ];
  }
  onMounted(() => {});
  onUnmounted(() => {});
</script>
<style scoped lang="less"></style>
