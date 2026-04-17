<template>
  <BasicModal
    :title="'处置'"
    :width="'50vw'"
    :height="500"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
    :okText="'确定'"
    :cancelText="'关闭'"
    :showOkBtn="!readonly"   
  >
    <div class="h-full" v-loading="state.loading">
      <!-- 预警信息展示区域 -->
      <a-descriptions :column="2" bordered size="small" title="预警信息">
        <a-descriptions-item label="矿山类型">{{ state.formState.bigTypeName }}</a-descriptions-item>
        <a-descriptions-item label="企业名称">{{ state.formState.companyName }}</a-descriptions-item>
        <a-descriptions-item label="设备类型">{{ state.formState.deviceTypeName }}</a-descriptions-item>
        <a-descriptions-item label="设备名称">{{ state.formState.deviceName }}</a-descriptions-item>
        <a-descriptions-item label="设备编号">{{ state.formState.deviceCode }}</a-descriptions-item>
        <a-descriptions-item label="预警信息">{{ state.formState.warningMessage }}</a-descriptions-item>
        <a-descriptions-item label="预警等级">{{ state.formState.warningLevelName }}</a-descriptions-item>
        <a-descriptions-item label="预警时间">{{ state.formState.warningTime }}</a-descriptions-item>
      </a-descriptions>

      <!-- 处置反馈表单 -->
      <a-divider orientation="left">处置反馈</a-divider>
      <a-form :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
        <a-form-item label="警情状况" name="disposalProgress" :rules="[{ required: true, message: '请选择警情状况' }]">
          <a-radio-group v-model:value="state.formState.disposalProgress" :disabled="readonly">
            <a-radio value="N">处置中</a-radio>
            <a-radio value="Y">已解除</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="处置说明" name="remarks">
          <a-textarea
            v-model:value="state.formState.remarks"
            placeholder="请输入处置说明"
            :rows="4"
            :maxlength="500"
            :disabled="readonly"
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
import { disposeWarning } from '../line.api';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '100px' } };
const wrapperCol = { style: { width: 'calc(100% - 100px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    bigTypeName: '',
    companyName: '',
    deviceTypeName: '',
    deviceName: '',
    deviceCode: '',
    warningMessage: '',
    warningLevelName: '',
    warningTime: '',
    disposalProgress: '',
    remarks: '',
  },
});

// 只读模式标志
const readonly = ref(false);

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  const { record, isView = false } = data;
  // 设置只读状态
  readonly.value = isView;
  // 将预警记录的数据填充到表单
  state.formState = {
    id: record.id,
    bigTypeName: record.bigTypeName,
    companyName: record.companyName,
    deviceTypeName: record.deviceTypeName,
    deviceName: record.deviceName,
    deviceCode: record.deviceCode,
    warningMessage: record.warningMessage,
    warningLevelName: record.warningLevelName,
    warningTime: record.warningTime,
    disposalProgress: record.disposalProgress,
    remarks: record.remarks,
  };
});

const handleOk = () => {
  // 查看模式直接关闭
  if (readonly.value) {
    closeModal();
    return;
  }

  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      const params = {
        id: state.formState.id,
        disposalProgress: state.formState.disposalProgress,
        remarks: state.formState.remarks,
      };
      await disposeWarning(params);
      emit('success');
      message.success('处置成功');
      closeModal();
    } catch (error) {
      message.error(error.message || '处置失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请填写完整信息');
  });
};

const handleCancel = () => {
  closeModal();
};
</script>

<style lang="less" scoped></style>