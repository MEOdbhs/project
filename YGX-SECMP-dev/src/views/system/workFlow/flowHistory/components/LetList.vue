<template>
  <BasicModal
    :title="title"
    :width="'80vw'"
    :height="500"
    :can-fullscreen="false"
    :maskClosable="false"
    :keyboard="false"
    v-bind="$attrs"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    @register="registerModal"
  >
    <div class="h-full">
      <BasicTable @register="registerTable" />
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listPageLet } from '../flowHistory.api';
  import { columnsLet } from '../flowHistory.data';

  // 当前的弹窗数据
  const title = '执行记录';
  const row = ref(null);
  // 注册弹窗
  const [registerModal] = useModalInner(async (data) => {
    row.value = data.row;
    getData();
  });

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'car-modal-template',
    tableProps: {
      showIndexColumn: true,
      title: '',
      api: listPageLet,
      columns: columnsLet,
      minHeight: 450,
      maxHeight: 490,
      showActionColumn: false,
      useSearchForm: false,
      beforeFetch: (params) => {
        params.processInstanceId = row.value?.processInstanceId;
      },
    },
  });
  // 注册列表
  const [registerTable, { reload, getForm }] = tableContext;
  const getData = async () => {
    reload();
  };
</script>
<style scoped></style>
