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
          <a-col :span="12" v-if="type != 'add'">
            <a-form-item label="凭证编号" name="voucherCode" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.voucherCode" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="记账日期" name="voucherDate" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker v-model:value="state.formState.voucherDate" type="date" placeholder="请选择" allowClear style="width: 100%" value-format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="关联确认单号" name="confirmNo" :rules="[{ required: true, message: '请输入' }]">
              <div style="display: flex; align-items: center">
                <a-input v-model:value="state.formState.confirmNo" placeholder="请输入" allowClear readonly />
                <a-button v-if="type != 'view'" type="primary" @click="handleSelectOutbound">选择</a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="关联出库单号" name="outboundNo">
              <a-input v-model:value="state.formState.outboundNo" placeholder="自动带出" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="凭证类型" name="voucherType" :rules="[{ required: true, message: '请输入' }]">
              <JDictSelectTag v-model:value="state.formState.voucherType" placeholder="请选择" dictCode="voucherType" :showChooseOption="false" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="记账人员" name="operator" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.operator" placeholder="请输入" readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">记账明细</a-divider>
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
            <a-form-item label="出库数量" name="confirmNumber" :rules="[{ required: true, message: '请输入' }]">
             <div style="display: flex;align-items: center;">
                 <a-input v-model:value="state.formState.confirmNumber" placeholder="自动带出" readonly  />
              <div style="width: 60px;margin: 0 10px;">单位</div>
              <a-input v-model:value="state.formState.unitName" placeholder="自动带出" readonly style="width: 120px" />
             </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单价（元）" name="unitPrice" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.unitPrice" placeholder="自动带出" readonly style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="金额（元）" name="allMoney" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.allMoney" placeholder="自动带出" readonly style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">账务信息</a-divider>
          <a-col :span="24">
            <a-form-item label="摘要" name="summary" :rules="[{ required: true, message: '请输入' }]">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.summary" placeholder="请输入" allowClear />
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
    <SelectOutbound @select="getOutboundInfo" @register="registerSelectOutbound" />
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById } from '../bookkeep.api';
import { getViewById as getOutboundById } from '../../outboundCheck/check.api';
import { message } from 'ant-design-vue';
import SelectOutbound from './SelectOutbound.vue';
import { useUserStore } from '/@/store/modules/user';
const [registerSelectOutbound, { openModal }] = useModal();
const emit = defineEmits(['success', 'register']);

const formRef = ref();
const userStore = useUserStore();
const labelCol = { style: { width: '170px' } };
const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
const state = reactive({
  loading: false,
  formState: {
    id: '',
    // 基本信息
    voucherCode: '',
    voucherDate: null,
    voucherType: '',
    operator: userStore.getUserInfo?.realname || '',
    // 关联出库
    confirmId: '',
    outboundId: '',
    confirmNo: '',
    outboundNo: '',
    // 物资明细
    materialId: '',
    materialCode: '',
    materialName: '',
    model: '',
    confirmNumber: null,
    unitName: '',
    unitPrice: null,
    allMoney: null,
    // 账务信息
    summary: '',
    remarks: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}应急物资记账信息`;
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

const handleSelectOutbound = () => {
  openModal(true, {
    type: 'single',
    data: state.formState.confirmId ? [state.formState.confirmId] : [],
  });
};
const getOutboundInfoById = async (id) => {
  const res = await getOutboundById({ id: id });
  setOutboundInfo(res);
};
const getOutboundInfo = (val) => {
  getOutboundInfoById(val.toString());
};
const setOutboundInfo = (cur) => {
  state.formState.confirmId = cur.id;
  state.formState.confirmNo = cur.confirmNo;
  state.formState.outboundId = cur.outboundId;
  state.formState.outboundNo = cur.outboundNo;
  state.formState.materialCode = cur.materialCode;
  state.formState.materialId = cur.materialId;
  state.formState.materialName = cur.materialName;
  state.formState.model = cur.model;
  state.formState.confirmNumber = cur.confirmNumber;
  state.formState.unitName = cur.unitName;
  state.formState.unitPrice = cur.unitPrice;
  state.formState.allMoney = cur.allMoney;
};
const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  Object.assign(state.formState, res);
  state.loading = false;
};
const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = state.formState;
    if (type.value === 'add') {
      delete params.id;
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
    voucherCode: '',
    voucherDate: null,
    voucherType: '',
    operator: userStore.getUserInfo?.realname || '',
    confirmId: '',
    outboundId: '',
    confirmNo: '',
    outboundNo: '',
    materialCode: '',
    materialId: '',
    materialName: '',
    model: '',
    confirmNumber: null,
    unitName: '',
    unitPrice: null,
    allMoney: null,
    summary: '',
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