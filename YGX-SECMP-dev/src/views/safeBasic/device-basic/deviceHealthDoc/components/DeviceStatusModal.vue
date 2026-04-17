<template>
  <BasicModal
    title="设备状态"
    :width="600"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    okText="确定"
    cancelText="关闭"
    @register="registerModal"
    @ok="handleOk"
  >
    <div class="p-4" v-loading="state.loading">
      <a-form :model="state.formState" ref="formRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="设备状态" name="expectStatus" :rules="[{ required: true, message: '请选择设备状态' }]">
          <a-select v-model:value="state.formState.expectStatus" placeholder="请选择设备状态">
            <a-select-option :value="0">在用</a-select-option>
            <a-select-option :value="1">保养</a-select-option>
            <a-select-option :value="2">维修</a-select-option>
            <a-select-option :value="3">报废</a-select-option>
            <a-select-option :value="4">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="执行日期" name="statusExecDt" :rules="[{ required: true, message: '请选择执行日期' }]">
          <a-date-picker
            v-model:value="state.formState.statusExecDt"
            placeholder="请选择"
            style="width: 100%"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="执行原因" name="statusExecReson" :rules="[{ required: true, message: '请输入执行原因' }]">
          <a-textarea
            v-model:value="state.formState.statusExecReson"
            placeholder="请输入"
            :rows="4"
            allowClear
          />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { updateStatusById } from '../line.api';

const emit = defineEmits(['success', 'register']);
const formRef = ref();

const state = reactive({
  loading: false,
  formState: {
    id: '',
    expectStatus: undefined,
    statusExecDt: '',
    statusExecReson: '',
  },
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  resetForm();
  if (data.record) {
    state.formState.id = data.record.id;
    state.formState.expectStatus = data.record.expectStatus;
    state.formState.statusExecDt = data.record.statusExecDt || '';
    state.formState.statusExecReson = data.record.statusExecReson || '';
  }
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    const params = {
      id: state.formState.id,
      expectStatus: state.formState.expectStatus,
      statusExecDt: state.formState.statusExecDt,
      statusExecReson: state.formState.statusExecReson,
    };
    updateStatusById(params)
      .then(() => {
        emit('success');
        message.success('设备状态修改成功');
        closeModal();
        resetForm();
      })
      .catch(() => {
        message.error('修改失败,请稍后再试');
      })
      .finally(() => {
        state.loading = false;
      });
  });
};

// 初始化表单值
const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    expectStatus: undefined,
    statusExecDt: '',
    statusExecReson: '',
  };
  state.loading = false;
};
</script>

<style lang="less" scoped></style>

