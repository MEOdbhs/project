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
              <a-form-item label="范围名称" name="name" :rules="[{ required: true, message: '请输入范围名称' }]">
                <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="关键词" name="keyword" :rules="[{ required: true, message: '请输入关键词' }]">
                <a-input v-model:value="state.formState.keyword" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="范围描述" name="memo" :rules="[{ required: true, message: '请输入范围描述' }]">
                <a-textarea v-model:value="state.formState.memo" placeholder="请输入" :rows="3" allowClear />
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
  import { saveOrUpdateScope, getScopeViewById } from '../line.api';
  
  const emit = defineEmits(['success']);
  const formRef = ref();
  const labelCol = { style: { width: '120px' } };
  const wrapperCol = { style: { width: 'calc(100% - 120px)' } };
  
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      name: '',
      memo: '',
      keyword: '',
      creator: '',
      createTime: '',
      updateTime: '',
    },
  });
  
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}工程管控范围`;
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
      const result = await getScopeViewById({ id: row.value.id });
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
        await saveOrUpdateScope(params);
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
      memo: '',
      keyword: '',
      creator: '',
      createTime: '',
      updateTime: '',
    };
    state.loading = false;
    formRef.value?.resetFields();
  };
  
  const handleCancel = () => {
    resetForm();
  };
  </script>
  
  <style lang="less" scoped></style>