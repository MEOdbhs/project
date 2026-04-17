<template>
  <BasicModal
    :title="title"
    :width="'50vw'"
    :height="250"
    :can-fullscreen="false"
    :maskClosable="false"
    :keyboard="false"
    v-bind="$attrs"
    @register="registerModal"
    cancelText="关闭"
    okText="确定"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="pl-10px pr-10px h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="激活关联流程实例" name="flag">
              <a-switch v-model:checked="state.formState.flag" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="定时激活" name="isDate">
              <a-switch v-model:checked="state.formState.isDate" @change="state.formState.date = undefined" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="激活时间" name="date">
              <a-date-picker v-model:value="state.formState.category" format="YYYY-MM-DD HH:mm:ss" show-time :disabled="!state.formState.isDate" />
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
  import { suspendProcessDefinition, activateProcessDefinition } from '../flowRelease.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const state = reactive({
    loading: false,
    formState: {
      pdid: '',
      //
      flag: true, //激活关联流程实例
      isDate: false, //定时激活
      date: undefined, //激活时间
    },
  });

  // 当前的弹窗数据
  const row = ref(null);
  const title = computed(() => {
    const str = (row.value?.suspended ? '挂起' : '激活') + '流程定义';
    return str;
  });
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    resetForm();
    state.formState.pdid = data.row.id;
  });

  const resetForm = () => {
    state.formState = {
      pdid: '',
      //
      flag: true, //激活关联流程实例
      isDate: false, //定时激活
      date: undefined, //激活时间
    };
  };
  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = state.formState;
      if (!params.isDate) {
        params.date = '';
      }
      if (row.value?.suspended) {
        activateProcessDefinition(params)
          .then(() => {
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
          })
          .catch(() => {
            message.error('保存失败,请稍后再试');
          })
          .finally(() => {
            state.loading = false;
          });
      } else {
        suspendProcessDefinition(params)
          .then(() => {
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
          })
          .catch(() => {
            message.error('保存失败,请稍后再试');
          })
          .finally(() => {
            state.loading = false;
          });
      }
    });
  };
  const handleCancel = () => {
    resetForm();
  };
</script>
<style></style>
