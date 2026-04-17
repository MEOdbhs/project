<template>
  <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="工艺编号" name="processCode" :rules="[{ required: true, message: '请输入工艺编号' }]">
              <a-input v-model:value="state.formState.processCode" placeholder="请输入工艺编号" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工艺名称" name="processName" :rules="[{ required: true, message: '请输入工艺名称' }]">
              <a-input v-model:value="state.formState.processName" placeholder="请输入工艺名称" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="工艺类型" name="processTypeId" :rules="[{ required: true, message: '请输入工艺类型' }]">
              <JDictSelectTag v-model:value="state.formState.processTypeId" placeholder="请选择" dictCode="hazard_process_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="原辅材料" name="rawMaterial" :rules="[{ required: true, message: '请输入原辅材料' }]">
              <a-input v-model:value="state.formState.rawMaterial" placeholder="请输入原辅材料" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="产物" name="product" :rules="[{ required: true, message: '请输入产物' }]">
              <a-input v-model:value="state.formState.product" placeholder="请输入产物" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate } from '../line.api'; 
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    processCode: '',
    processName: '',
    processTypeId: '',
    rawMaterial: '',
    product: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}工艺信息`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    Object.assign(state.formState, { ...row.value });
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

const handleOk = () => {
  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      let params = { ...state.formState };
      if (type.value === 'add') {
        delete params.id;
      }
      await saveOrUpdate(params);
      emit('success');
      message.success('保存成功');
      closeModal();
      resetForm();
    } catch (error) {
      message.error(error.message || '保存失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请检查表单填写');
  });
};

const resetForm = () => {
  state.formState = {
    id: '',
    processCode: '',
    processName: '',
    processTypeId: '',
    rawMaterial: '',
    product: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>