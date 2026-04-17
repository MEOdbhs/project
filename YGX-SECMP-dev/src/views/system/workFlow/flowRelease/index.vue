<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
    <template #tableTitle>
      <a-button @click="handleAdd" class="mr-2" type="primary" preIcon="ant-design:plus-outlined">部署</a-button>
    </template>
    <template #detail="{ record }">
      <a-button type="text" @click="viewFlow(record)">查看定义</a-button>
      <a-button type="text" @click="viewFlowImage(record)">查看流程图</a-button>
    </template>
  </BasicTable>
  <AddOrEditData @register="registerModal" @success="reload" />
  <Upload @register="registerModal1" @success="reload" />
  <Flow @register="registerModal2" />
  <FlowImg @register="registerModal3" />
</template>
<script name="system-workFlow-flowRelease" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './flowRelease.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listPage, deleteModel, exchangeProcessToModel, showresource } from './flowRelease.api';

  import AddOrEditData from './components/AddOrEditData.vue';
  import Upload from './components/Upload.vue';
  import Flow from '../components/Flow.vue';
  import FlowImg from '../components/FlowImg.vue';
  import { onMounted, onUnmounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { getToken } from '/@/utils/auth';

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'listPage-template',
    tableProps: {
      title: '流程发布列表',
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
        width: 140,
      },
      rowSelection: null,
      beforeFetch: (params) => {
        params.latest = false;
        if (!params.key) {
          params.key = '';
        }
        if (!params.name) {
          params.name = '';
        }
        if (!params.version) {
          params.version = '';
        }
      },
    },
  });
  const [registerTable, { reload }] = tableContext;
  // 注册 modal
  const [registerModal, { openModal }] = useModal();
  const [registerModal1, { openModal: openModal1 }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();
  const [registerModal3, { openModal: openModal3 }] = useModal();

  const handleAdd = () => {
    openModal1(true);
  };
  const handleDelete = async (record) => {
    await deleteModel(record.deploymentId, reload);
  };
  const viewFlow = (record) => {
    let VITE_GLOB_API_URL = import.meta.env.VITE_GLOB_API_URL || '/';
    localStorage.setItem('VITE_GLOB_API_URL', VITE_GLOB_API_URL);
    const tk = getToken();
    localStorage.setItem('tk', tk);

    const modelerUrl = `/static/bpmnjs/index.html?type=lookDefineBpmn&deploymentId=${record.deploymentId}&resourceName=${record.resourceName}`;
    openModal2(true, {
      modelerUrl: modelerUrl,
      title: '查看定义',
    });
  };
  const viewFlowImage = async (record) => {
    const res = await showresource(record.id);
    if (res?.code === 500) {
      message.error(res?.msg);
      return;
    }
    const url = window.URL.createObjectURL(res);
    openModal3(true, {
      modelerUrl: url,
      title: '流程图片',
    });
  };
  const showActivation = (record) => {
    openModal(true, {
      row: record,
    });
  };
  const handleToModel = async (record) => {
    await exchangeProcessToModel(record.id, reload);
  };

  function getTableAction(record) {
    return [
      {
        label: '挂起',
        onClick: showActivation.bind(null, record),
        ifShow: record.suspended,
      },
      {
        label: '激活',
        onClick: showActivation.bind(null, record),
        ifShow: !record.suspended,
      },
      {
        label: '转为模型',
        onClick: handleToModel.bind(null, record),
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
    localStorage.removeItem('UserList');
    localStorage.removeItem('RoleList');
  });
</script>
<style scoped lang="less"></style>
