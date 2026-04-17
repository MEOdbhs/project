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
            <a-form-item label="质检单号" name="inspectionNo" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.inspectionNo" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="质检日期" name="inspectionDate" :rules="[{ required: true, message: '请输入' }]">
              <a-date-picker
                v-model:value="state.formState.inspectionDate"
                type="date"
                placeholder="请选择"
                allowClear
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="关联入库单号" name="warehouseEntryNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.warehouseEntryNumber" placeholder="自动带出" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="质检类型" name="inspectionType" :rules="[{ required: true, message: '请输入' }]">
              <JDictSelectTag
                v-model:value="state.formState.inspectionType"
                placeholder="请选择"
                dictCode="inspectionType"
                :showChooseOption="false"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="质检人员" name="inspectionOperator" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.inspectionOperator" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">质检物资明细</a-divider>
          <a-col :span="12">
            <a-form-item label="物资编码" name="materialCode" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.materialCode" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="物资名称" name="materialName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.materialName" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="规格型号" name="model" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.model" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入库数量" name="entryNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.entryNumber" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="检验数量"
              name="inspectionNum"
              :rules="[
                { required: true, message: '请输入' },
                { validator: validateInspectionNum, trigger: 'change' },
              ]"
            >
              <a-input-number
                v-model:value="state.formState.inspectionNum"
                placeholder="请输入"
                :min="0"
                :precision="0"
                allowClear
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="合格数量"
              name="qualifiedNum"
              :rules="[
                { required: true, message: '请输入' },
                { validator: validateQualifiedNum, trigger: 'change' },
              ]"
            >
              <a-input-number
                v-model:value="state.formState.qualifiedNum"
                placeholder="请输入"
                :min="0"
                :precision="0"
                allowClear
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="不合格数量" name="noQualifiedNum" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.noQualifiedNum" placeholder="自动计算" style="width: 100%" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合格率" name="passRate" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.passRate" placeholder="自动计算" style="width: 100%" readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">质检结果</a-divider>
          <a-col :span="12">
            <a-form-item label="检验结果" name="testResults" :rules="[{ required: true, message: '请输入' }]">
              <a-select v-model:value="state.formState.testResults" placeholder="请选择">
                <a-select-option value="Y">合格</a-select-option>
                <a-select-option value="N">不合格</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="不合格原因" name="unacceptableReason">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.unacceptableReason" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="处理意见" name="handlingOpinion">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.handlingOpinion" placeholder="请输入" allowClear />
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
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById } from '../check.api';
import { getMaterialById } from '/@/views/emergencySafetyInfoDatabase/emergencyRescueSupplies/outboundManage/rescueOutbound/outbound.api';
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
    inspectionNo: '',
    inspectionDate: null,
    warehouseEntryNumber: '',
    inspectionType: '',
    inspectionOperator: userStore.getUserInfo?.realname || '',
    // 检验物资明细
    materialCode: '',
    materialName: '',
    model: '',
    inspectionNum: null,
    qualifiedNum: null,
    noQualifiedNum: null,
    passRate: null,
    entryNumber: null,
    // 质检结果
    testResults: '',
    unacceptableReason: '',
    handlingOpinion: '',
    remarks: '',
  },
});

const validateInspectionNum = async (_rule, value) => {
  if (value && state.formState.entryNumber) {
    const inspectionNum = Number(value);
    const entryNumber = Number(state.formState.entryNumber);

    if (inspectionNum > entryNumber) {
      return Promise.reject('检验数量不能大于入库数量');
    }
  }
  return Promise.resolve();
};
const validateQualifiedNum = async (_rule, value) => {
  if (value && state.formState.inspectionNum) {
    const qualifiedNum = Number(value);
    const inspectionNum = Number(state.formState.inspectionNum);

    if (qualifiedNum > inspectionNum) {
      return Promise.reject('合格数量不能大于校验数量');
    }
  }
  return Promise.resolve();
};
// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'edit' ? '质检' : '查看';
  return `${str}应急物资入库信息`;
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
  () => [state.formState.inspectionNum, state.formState.qualifiedNum],
  ([inspectionNum, qualifiedNum]) => {
    if (inspectionNum && qualifiedNum) {
      state.formState.noQualifiedNum = inspectionNum - qualifiedNum;
      state.formState.passRate = ((qualifiedNum / inspectionNum) * 100).toFixed(2);
    }
    if (!inspectionNum || !qualifiedNum) {
      state.formState.noQualifiedNum = null;
      state.formState.passRate = null;
    }
    if (inspectionNum === 0 || qualifiedNum === 0) {
      state.formState.passRate = null;
      state.formState.noQualifiedNum = null;
    }
  }
);
const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  Object.assign(state.formState, res);
  if (type.value == 'edit') {
    state.formState.inspectionOperator = userStore.getUserInfo?.realname || '';
  }
  if (state.formState.testResults === 'S') {
    state.formState.testResults = null;
  }
  const materialRes = await getMaterialById({ id: state.formState.materialId });
  setMaterialInfo(materialRes);
  state.loading = false;
};
const setMaterialInfo = (cur) => {
  state.formState.materialCode = cur.materialCode;
  state.formState.model = cur.specification;
};
const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = state.formState;
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
    inspectionNo: '',
    inspectionDate: null,
    warehouseEntryNumber: '',
    inspectionType: '',
    inspectionOperator: userStore.getUserInfo?.realname || '',
    materialCode: '',
    materialName: '',
    entryNumber: null,
    model: '',
    inspectionNum: null,
    qualifiedNum: null,
    noQualifiedNum: null,
    passRate: null,
    testResults: '',
    unacceptableReason: '',
    handlingOpinion: '',
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