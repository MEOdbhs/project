<template>
  <BasicModal
    :title="state.title"
    :width="'80vw'"
    :height="600"
    :can-fullscreen="true"
    :defaultFullscreen="true"
    :maskClosable="false"
    :keyboard="false"
    v-bind="$attrs"
    @register="registerModal"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    :footer="null"
    @cancel="close"
  >
    <div class="pl-10px pr-10px h-full" v-loading="state.loading" style="background-color: #fff;">
      <iframe id="modeler-iframe" :src="state.modelerUrl" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>
    </div>
  </BasicModal>
</template>

<script setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const state = reactive({
    loading: false,
    modelerUrl: '',
    title: '流程图',
  });

  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    state.modelerUrl = data.modelerUrl;
    state.title = data.title ? data.title : '流程图';
  });
  const close = () => {
    localStorage.removeItem('VUE_APP_BASE_API');
    localStorage.removeItem('tk');
    localStorage.removeItem('UserList');
    localStorage.removeItem('RoleList');
  };
</script>
<style></style>
