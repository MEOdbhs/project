<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
    <template #tableTitle>
      <a-button @click="handleAdd" class="mr-2" type="primary" preIcon="ant-design:plus-outlined">新增模型</a-button>
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
  <Flow @register="registerModal2" />
</template>
<script name="system-workFlow-flowDesign" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './flowDesign.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listPage, deleteModel, deployModel, exportModel } from './flowDesign.api';

  import AddOrEditData from './components/AddOrEditData.vue';
  import Flow from '../components/Flow.vue';
  import { onMounted, onUnmounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getToken } from '/@/utils/auth';

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'listPage-template',
    tableProps: {
      title: '流程设计列表',
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
        width: 180,
      },
      rowSelection: null,
    },
  });
  const [registerTable, { reload }] = tableContext;
  // 注册 modal
  const [registerModal, { openModal }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();

  const handleAdd = () => {
    openModal(true, {
      row: null,
      type: 'add',
    });
  };
  const handleDelete = async (record) => {
    await deleteModel(record.id, reload);
  };
  const handleDesign = (record) => {
    const metaInfo = JSON.parse(record.metaInfo);
    let VITE_GLOB_API_URL = import.meta.env.VITE_GLOB_API_URL || '/';
    localStorage.setItem('VITE_GLOB_API_URL', VITE_GLOB_API_URL);
    const tk = getToken();
    localStorage.setItem('tk', tk);
    const modelerUrl = `/static/bpmnjs/index.html?type=addBpmn&modelId=${record.id}&key=${record.key}&version=${record.version}&name=${record.name}&category=${record.category}&description=${metaInfo.description}`;
    openModal2(true, {
      modelerUrl: modelerUrl,
    });
  };
  const handleDeploy = async (record) => {
    await deployModel(record.id, reload);
  };
  const handleExport = async (record) => {
    const res = await exportModel(record.id);
    const blob = new Blob([res.data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    downloadByUrl({
      url,
      fileName: record.name + '.bpmn',
    });
  };

  function getTableAction(record) {
    return [
      {
        label: '设计',
        onClick: handleDesign.bind(null, record),
      },
      {
        label: '发布',
        onClick: handleDeploy.bind(null, record),
        ifShow: !record.deploymentId,
      },
      {
        label: '导出',
        onClick: handleExport.bind(null, record),
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
  onMounted(() => {});
  onUnmounted(() => {
    localStorage.removeItem('VITE_GLOB_API_URL');
    localStorage.removeItem('tk');
    localStorage.removeItem('tk');
    localStorage.removeItem('UserList');
    localStorage.removeItem('RoleList');
  });
</script>
<style scoped lang="less"></style>
