<template>
  <BasicModal
    :title="title"
    :width="'60vw'"
    :height="500"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    v-bind="$attrs"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form
        ref="formRef"
        :model="state.formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="防护名称" name="name" :rules="[{ required: true, message: '请输入防护名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建设标准" name="standard" :rules="[{ required: true, message: '请输入建设标准' }]">
              <a-input v-model:value="state.formState.standard" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管护责任" name="duty" :rules="[{ required: true, message: '请输入管护责任' }]">
              <a-input v-model:value="state.formState.duty" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急加固物资" name="supply" :rules="[{ required: true, message: '请输入应急加固物资' }]">
              <a-input v-model:value="state.formState.supply" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="存放位置" name="loc" :rules="[{ required: true, message: '请输入存放位置' }]">
              <a-input v-model:value="state.formState.loc" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数量" name="count" :rules="[{ required: true, message: '请输入数量' }]">
              <a-input-number v-model:value="state.formState.count" :min="0" style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管理责任人" name="manager" :rules="[{ required: true, message: '请输入管理责任人' }]">
              <a-input v-model:value="state.formState.manager" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系方式" name="contact" :rules="[{ required: true, message: '请输入联系方式' }]">
              <a-input v-model:value="state.formState.contact" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdateEngineering, getEngineeringViewById } from '../line.api';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    standard: '',
    duty: '',
    supply: '',
    loc: '',
    count: undefined,
    manager: '',
    contact: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}工程防护及应急加固设施`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    const result = await getEngineeringViewById({ id: row.value.id });
    Object.assign(state.formState, result);
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
      if (type.value === 'add') delete params.id;
      await saveOrUpdateEngineering(params);
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
    name: '',
    standard: '',
    duty: '',
    supply: '',
    loc: '',
    count: undefined,
    manager: '',
    contact: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>