<template>
  <BasicModal
    :title="title"
    :width="'55vw'"
    :height="340"
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
          <a-col :span="12">
            <a-form-item label="物资编码" name="materialCode">
              <a-input disabled v-model:value="state.formState.materialCode" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="物资名称" name="materialName" :rules="[{ required: true, message: '请输入物资名称' }]">
              <a-input disabled v-model:value="state.formState.materialName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="当前库存" name="currentStock" :rules="[{ required: true, message: '请输入当前库存' }]">
              <a-input disabled v-model:value="state.formState.currentStock" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低库存" name="inventoryMin" :rules="inventoryMinRules">
              <a-input v-model:value="state.formState.inventoryMin" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最高库存" name="inventoryMax" :rules="inventoryMaxRules">
              <a-input v-model:value="state.formState.inventoryMax" allowClear />
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
      edit: '编辑',
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
      materialId: null,
      inventoryMin: null,
      inventoryMax: null,
    };
  }
  const validateInventoryLimit = (_rule, value) => {
    if (value === null || value === undefined || value === '') {
      return Promise.resolve();
    }
    const valueStr = String(value).trim();
    const numberValue = Number(valueStr);
    const decimalReg = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;
    if (Number.isNaN(numberValue) || numberValue < 0 || !decimalReg.test(valueStr)) {
      return Promise.reject('请输入0及以上数字，最多2位小数');
    }
    return Promise.resolve();
  };
  const validateInventoryMin = () => {
    const minValue = toNumberOrNull(state.formState.inventoryMin);
    const maxValue = toNumberOrNull(state.formState.inventoryMax);
    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      return Promise.reject('最低库存不能大于最高库存');
    }
    return Promise.resolve();
  };
  const validateInventoryMax = () => {
    const minValue = toNumberOrNull(state.formState.inventoryMin);
    const maxValue = toNumberOrNull(state.formState.inventoryMax);
    if (minValue !== null && maxValue !== null && maxValue < minValue) {
      return Promise.reject('最高库存不能小于最低库存');
    }
    return Promise.resolve();
  };
  const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numberValue = Number(String(value).trim());
    return Number.isNaN(numberValue) ? null : numberValue;
  };
  const inventoryMinRules = [
    { validator: validateInventoryLimit, trigger: ['blur', 'change'] },
    { validator: validateInventoryMin, trigger: ['blur', 'change'] },
  ];
  const inventoryMaxRules = [
    { validator: validateInventoryLimit, trigger: ['blur', 'change'] },
    { validator: validateInventoryMax, trigger: ['blur', 'change'] },
  ];

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
      const { id, materialId, inventoryMin, inventoryMax } = state.formState;
      const params = {
        id,
        materialId,
        inventoryMin,
        inventoryMax,
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
</style>
