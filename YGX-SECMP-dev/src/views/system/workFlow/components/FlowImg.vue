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
    :footer="false"
  >
    <div class="pl-10px pr-10px h-full">
      <a-image :src="modelerUrl" />
    </div>
  </BasicModal>
</template>

<script setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const state = reactive({
    modelerUrl: '',
    title: '流程图片',
  });

  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    state.modelerUrl = data.modelerUrl;
    state.title = data.title ? data.title : '流程图片';
  });
</script>
<style></style>
