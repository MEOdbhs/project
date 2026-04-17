<template>
  <BasicModal
    :title="title"
    :width="'55vw'"
    :height="380"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly" autocomplete="off">
        <a-row :gutter="24">
          <a-col :span="24">
            <div class="public-title">预警信息</div>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预警物资" name="materialName">
              <a-input disabled v-model:value="state.formState.materialName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预警状态" name="warningStatusName">
              <a-tag :color="state.formState.warningStatusName == '低于阈值' ? 'red' : 'blue'">{{ state.formState.warningStatusName }}</a-tag>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低库存" name="inventoryMin">
              <a-input disabled v-model:value="state.formState.inventoryMin" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最高库存" name="inventoryMax">
              <a-input disabled v-model:value="state.formState.inventoryMax" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="当前库存" name="currentStock">
              <a-input disabled v-model:value="state.formState.currentStock" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预警数量" name="warningNumber">
              <a-input disabled v-model:value="state.formState.warningNumber" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <div class="public-title">处理操作</div>
          </a-col>
          <a-col :span="24">
            <a-form-item label="处理方式" name="handleOperation" :rules="[{ required: true, message: '请输入处理方式' }]">
              <a-textarea v-model:value="state.formState.handleOperation" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { saveOrUpdate } from '../line.api';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const type = ref('add');
  const row = ref<any>({});
  const labelCol = { style: { width: '120px' } };
  const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

  const state = reactive({
    loading: false,
    formState: createDefaultFormState(),
  });

  const title = computed(() => {
    const typeMap = {
      add: '新增',
      edit: '处理',
      view: '查看',
    };
    return typeMap[type.value] || '查看';
  });

  const readonly = computed(() => type.value === 'view');

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    type.value = data.type;
    row.value = data.row || {};
    resetForm();
    if (data.row) {
      Object.assign(state.formState, data.row);
      state.formState.handleOperation = state.formState.handleWay;
    }
  });

  const resetForm = () => {
    formRef.value?.clearValidate?.();
    state.formState = createDefaultFormState();
    state.loading = false;
  };
  // 创建默认表单状态
  function createDefaultFormState() {
    return {
      id: '',
      materialCode: '',
      materialName: '',
      currentStock: null,
      inventoryMin: null,
      inventoryMax: null,
      handleOperation: '',
      warningNumber: null,
      handleStatus: '',
      warningStatusName: '',
      handleWay: '',
    };
  }

  const handleCancel = () => {
    resetForm();
  };
  // 提交
  const handleOk = async () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    await formRef.value?.validate();
    state.loading = true;
    try {
      const params = {
        id: state.formState.id,
        handleWay: state.formState.handleOperation,
      };
      await saveOrUpdate(params);
      state.loading = false;
      message.success('保存成功');
      emit('success');
      closeModal();
      resetForm();
    } catch (error) {
      state.loading = false;
      message.error('保存失败，请稍后重试');
      return;
    } finally {
      state.loading = false;
    }
  };
</script>
<style>
  .approval-user-select {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .public-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;
    margin-left: 12px;
  }
</style>
