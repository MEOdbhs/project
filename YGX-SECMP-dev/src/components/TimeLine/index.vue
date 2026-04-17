<template>
  <BasicModal
    title="流程进度"
    :width="'70vw'"
    :height="600"
    :can-fullscreen="true"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :footer="null"
    @register="registerModal"
  >
    <div class="timeline-modal-content">
      <!-- 直接使用 timeFlow 组件 -->
      <TimeFlow :dialog="dialogData" />
    </div>
  </BasicModal>
</template>

<script setup>
import { ref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import TimeFlow from './timeFlow.vue';

const emit = defineEmits(['register']);

const dialogData = ref({
  id: '',
});

// 注册弹窗
const [registerModal] = useModalInner(async (data) => {
  console.log('流程进度弹窗接收到的数据:', data.businessId);
  
  // 设置业务ID，传递给 timeFlow 组件
  // 只有当 id 变化时才更新，避免触发不必要的响应式更新
  const newId = data.businessId || '';
  if (dialogData.value.id !== newId) {
    console.log('更新 dialogData:', newId);
    dialogData.value = {
      id: newId,
    };
  } else {
    console.log('dialogData 未变化，不更新');
  }
});
</script>

<style lang="less" scoped>
.timeline-modal-content {
  min-height: 400px;
  width: 100%;
  
  // 移除 BasicModal 默认的内边距，让内容撑满
  :deep(.scroll-container) {
    padding: 12px 16px !important;
  }
}
</style>

