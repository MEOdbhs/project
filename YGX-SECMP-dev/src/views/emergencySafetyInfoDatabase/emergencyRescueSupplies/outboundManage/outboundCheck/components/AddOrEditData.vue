<template>
  <BasicModal
    :title="title"
    :width="'50vw'"
    :height="500"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full pl-10px pr-10px" v-loading="state.loading">
      <a-form
        :model="state.formState"
        name="basic"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
        ref="formRef"
      >
        <a-row>
          <a-divider orientation="left">基本信息</a-divider>
          <a-col :span="12">
            <a-form-item label="确认单号" name="confirmNo" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.confirmNo" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="确认日期" name="confirmDate" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.confirmDate"
                type="date"
                placeholder="请选择"
                allowClear
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="关联出库单号" name="outboundNo" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.outboundNo" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="确认人员" name="operator" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.operator" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">确认物资明细</a-divider>
          <a-col :span="12">
            <a-form-item label="物资编码" name="materialCode" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.materialCode" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="物资名称" name="materialName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.materialName" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="规格型号" name="model" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.model" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="当前库存" name="currentStock" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.currentStock" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="申请出库数量" name="entryNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.entryNumber" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实际确认数量" name="confirmNumber" :rules="[{ required: true, message: '请输入' }, { validator: validateConfirmNum, trigger: ['blur', 'change'] }]">
              <a-input-number v-model:value="state.formState.confirmNumber" placeholder="请输入" allowClear :min="0" :precision="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数量差异" name="differenceNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.differenceNumber" placeholder="自动计算" readonly style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位" name="unitName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.unitName" placeholder="自动带出" allowClear style="width: 100%" readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">确认结果</a-divider>
          <a-col :span="12">
            <a-form-item label="确认结果" name="confirmResult" :rules="[{ required: true, message: '请选择' }]">
              <a-select v-model:value="state.formState.confirmResult" placeholder="请选择">
                <a-select-option value="Y">通过</a-select-option>
                <a-select-option value="N">拒绝</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="差异原因" name="differenceReason">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.differenceReason" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="确认意见" name="confirmOpinion">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.confirmOpinion" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remarks">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.remarks" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { saveOrUpdate, getViewById } from '../check.api';
import { message } from 'ant-design-vue';
import { useUserStore } from '/@/store/modules/user';
const emit = defineEmits(['success', 'register']);
const userStore = useUserStore();
const formRef = ref();
const labelCol = { style: { width: '170px' } };
const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
const state = reactive({
  loading: false,
  formState: {
    id: '',
    // 基本信息
    confirmNo: '',
    confirmDate: null,
    outboundNo: '',
    operator: userStore.getUserInfo?.realname || '',
    // 物资明细
    materialCode: '',
    materialId: '',
    materialName: '',
    model: '',
    entryNumber: null,
    confirmNumber: null,
    differenceNumber: null,
    unitName: '',
    currentStock: '',
    // 结果及备注
    confirmResult: '',
    differenceReason: '',
    confirmOpinion: '',
    remarks: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'edit' ? '确认' : '查看';
  return `${str}应急物资出库信息`;
});
let readonly = computed(() => {
  return type.value == 'view';
});
// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    getData();
  }
});

watch(
  () => state.formState.confirmNumber,
  (confirmNumber) => {
    state.formState.differenceNumber = state.formState.entryNumber - state.formState.confirmNumber;
    if(!confirmNumber) {
        state.formState.differenceNumber = '';
    }
  }
);

const validateConfirmNum = async (_rule, value) => {
  if (value && state.formState.currentStock) {
    const confirmNumber = Number(value);
    const entryNumber = Number(state.formState.entryNumber);

    if (confirmNumber > entryNumber) {
      return Promise.reject('实际确认数量不能大于申请出库数量');
    }
  }
  return Promise.resolve();
};
const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  Object.assign(state.formState, res);
  if (type.value == 'edit') {
    state.formState.operator = userStore.getUserInfo?.realname || '';
  }
  if (state.formState.confirmResult === 'S') {
    state.formState.confirmResult = null;
  }
  state.loading = false;
};
const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = state.formState;
    if (params.confirmResult === 'Y' && params.currentStock === 0) {
      message.error('当前库存为0，不能确认通过');
      return;
    }
    saveOrUpdate(params)
      .then(() => {
        emit('success');
        message.success('保存成功');
        closeModal();
        resetForm();
      })
      .catch(() => {})
      .finally(() => {
        state.loading = false;
      });
  });
};
// 初始化表单值
const resetForm = () => {
  // form的resetFields在部分情况下，部分表单值和校验结果无法清除重置、故用以下方式
  formRef.value.clearValidate();
  state.formState = {
    id: '',
    confirmNo: '',
    confirmDate: null,
    outboundNo: '',
    operator: '',
    materialCode: '',
    materialId: '',
    materialName: '',
    model: '',
    entryNumber: null,
    confirmNumber: null,
    differenceNumber: null,
    currentStock: null,
    unitName: '',
    confirmResult: '',
    differenceReason: '',
    confirmOpinion: '',
    remarks: '',
  };
  state.loading = false;
};
const handleCancel = () => {
  resetForm();
};
</script>
<style lang="less" scoped>
</style>