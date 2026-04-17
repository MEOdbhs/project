<template>
  <BasicModal
    :title="title"
    :width="'92vw'"
    :height="650"

    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    v-bind="$attrs"
    :showOkBtn="!readonly"
    okText="确定"
    cancelText="取消"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full overflow-y-auto" v-loading="state.loading">
      <a-form
        ref="formRef"
        :model="state.formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <div class="section-title">基本信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="合同编号" name="contractCode">
              <a-input v-model:value="state.formState.contractCode" :disabled="true" placeholder="系统自动生成" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同名称" name="contractName" :rules="[{ required: true, message: '请输入合同名称' }]">
              <a-input v-model:value="state.formState.contractName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="合同金额(元)"
              name="contractAmount"
              :rules="[{ required: true, message: '请输入合同金额' }]"
            >
              <a-input-number v-model:value="state.formState.contractAmount" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否终止" name="isTerminated">
              <a-select v-model:value="state.formState.isTerminated" :options="terminatedOptions" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同状态" name="contractStatus">
              <a-select v-model:value="state.formState.contractStatus" :options="contractStatusOptions" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="section-title">合同方信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="甲方名称" name="partyAName" :rules="[{ required: true, message: '请输入甲方名称' }]">
              <a-input v-model:value="state.formState.partyAName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="乙方名称" name="partyBName" :rules="[{ required: true, message: '请输入乙方名称' }]">
              <a-input v-model:value="state.formState.partyBName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="甲方联系人" name="partyAContact">
              <a-input v-model:value="state.formState.partyAContact" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="乙方联系人" name="partyBContact">
              <a-input v-model:value="state.formState.partyBContact" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="甲方联系电话" name="partyAPhone">
              <a-input v-model:value="state.formState.partyAPhone" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="乙方联系电话" name="partyBPhone">
              <a-input v-model:value="state.formState.partyBPhone" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="section-title">合同期限</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="签订日期" name="signDate" :rules="[{ required: true, message: '请选择签订日期' }]">
              <a-date-picker
                v-model:value="state.formState.signDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="生效日期"
              name="effectiveDate"
              :rules="[{ required: true, message: '请选择生效日期' }]"
            >
              <a-date-picker
                v-model:value="state.formState.effectiveDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="到期日期" name="expiryDate" :rules="[{ required: true, message: '请选择到期日期' }]">
              <a-date-picker
                v-model:value="state.formState.expiryDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同期限(天)" name="contractDuration">
              <a-input :value="state.formState.contractDuration" disabled placeholder="自动计算" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="section-title">支付记录</div>
        <div class="mb-12px" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddPaymentRecord">添加</a-button>
          <a-button danger @click="handleBatchDelete">删除</a-button>
        </div>
        <a-table
          :columns="paymentColumns"
          :data-source="state.formState.contractPaymentList"
          :pagination="false"
          :row-key="(r) => r.rowId ?? r.id ?? ''"
          :row-selection="readonly ? undefined : rowSelection"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'paymentMethod'">
              <a-input v-if="!readonly" v-model:value="record.paymentMethod" allowClear />
              <span v-else>{{ record.paymentMethod ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'paymentAmount'">
              <a-input-number v-if="!readonly" v-model:value="record.paymentAmount" :min="0" style="width: 100%" />
              <span v-else>{{ record.paymentAmount ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'paymentRatio'">
              <a-input-number v-if="!readonly" v-model:value="record.paymentRatio" :min="0" :max="100" style="width: 100%" />
              <span v-else>{{ record.paymentRatio ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'paymentDate'">
              <a-date-picker
                v-if="!readonly"
                v-model:value="record.paymentDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
              />
              <span v-else>{{ record.paymentDate ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'remarks'">
              <a-input v-if="!readonly" v-model:value="record.remarks" allowClear />
              <span v-else>{{ record.remarks ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly" @click="handleDeletePaymentRecord(record)">删除</a-button>
              <span v-else>-</span>
            </template>
          </template>
        </a-table>

        <div class="section-title">其他信息</div>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="合同描述" name="contractDesc">
              <a-textarea v-model:value="state.formState.contractDesc" :rows="3" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remarks">
              <a-textarea v-model:value="state.formState.remarks" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import type { ContractRecord, PaymentRecord } from '../line.api';
import { getNextContractCode, getViewById, saveOrUpdate } from '../line.api';
import { contractStatusEnum } from '../line.data';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const selectedRowKeys = ref<string[]>([]);
const type = ref('add');
const row = ref<any>({});

const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 140px)' } };
const terminatedOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];
const contractStatusOptions = [
  { label: '未开始', value: contractStatusEnum.notStarted },
  { label: '进行中', value: contractStatusEnum.processing },
  { label: '已完成', value: contractStatusEnum.completed },
  { label: '已终止', value: contractStatusEnum.terminated },
];

const paymentColumns = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '支付方式', dataIndex: 'paymentMethod', width: 140 },
  { title: '支付金额(元)', dataIndex: 'paymentAmount', width: 160 },
  { title: '支付比例(%)', dataIndex: 'paymentRatio', width: 120 },
  { title: '支付日期', dataIndex: 'paymentDate', width: 160 },
  { title: '备注', dataIndex: 'remarks' },
  { title: '操作', dataIndex: 'action', width: 100 },
];

const state = reactive({
  loading: false,
  formState: createDefaultFormState(),
});

const title = computed(() => {
  const typeMap = {
    add: '新增',
    edit: '修改',
    view: '查看',
  };
  return typeMap[type.value] || '查看';
});

const readonly = computed(() => {
  return type.value === 'view';
});

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: string[]) => {
      selectedRowKeys.value = keys;
    },
  };
});

watch(
  () => [state.formState.effectiveDate, state.formState.expiryDate],
  ([startDate, endDate]) => {
    state.formState.contractDuration = calcDays({ startDate, endDate });
  },
  { immediate: true },
);

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') {
    //const code = await getNextContractCode();
    //state.formState.contractCode = code;
    return;
  }
  await getData();
});

function createDefaultFormState(): ContractRecord {
  return {
    contractCode: '',
    contractName: '',
    contractAmount: undefined,
    isTerminated: 1,
    partyAName: '',
    partyAContact: '',
    partyAPhone: '',
    partyBName: '',
    partyBContact: '',
    partyBPhone: '',
    signDate: '',
    effectiveDate: '',
    expiryDate: '',
    contractDuration: undefined,
    contractDesc: '',
    remarks: '',
    contractStatus: contractStatusEnum.notStarted,
    contractPaymentList: [],
  };
}

function calcDays({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  if (!startDate || !endDate) return undefined;
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) return undefined;
  return Math.floor((endTime - startTime) / 86400000);
}

async function getData() {
  state.loading = true;
  const data = await getViewById({ id: row.value.id });
  if (data) Object.assign(state.formState, data);
  state.loading = false;
}

function resetForm() {
  formRef.value?.clearValidate?.();
  selectedRowKeys.value = [];
  state.formState = createDefaultFormState();
  state.loading = false;
}

function getPaymentRowKey(record: PaymentRecord) {
  return record.rowId ?? record.id ?? '';
}

function handleAddPaymentRecord() {
  if (readonly.value) return;
  const rowId = `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  state.formState.contractPaymentList = state.formState.contractPaymentList ?? [];
  state.formState.contractPaymentList.push({
    rowId,
    paymentMethod: '',
    paymentAmount: undefined,
    paymentRatio: undefined,
    paymentDate: '',
    remarks: '',
  });
}

function handleDeletePaymentRecord(record: PaymentRecord) {
  if (readonly.value) return;
  const key = getPaymentRowKey(record);
  state.formState.contractPaymentList = (state.formState.contractPaymentList ?? []).filter(
    (item) => getPaymentRowKey(item) !== key,
  );
  selectedRowKeys.value = selectedRowKeys.value.filter((k) => k !== key);
}

function handleBatchDelete() {
  if (readonly.value || !selectedRowKeys.value.length) return;
  const set = new Set(selectedRowKeys.value);
  state.formState.contractPaymentList = (state.formState.contractPaymentList ?? []).filter(
    (item) => !set.has(getPaymentRowKey(item)),
  );
  selectedRowKeys.value = [];
}

function handleCancel() {
  resetForm();
}

async function handleOk() {
  if (readonly.value) {
    closeModal();
    return;
  }
  await formRef.value?.validate();
  state.loading = true;
  const params: ContractRecord = {
    ...state.formState,
    contractPaymentList: (state.formState.contractPaymentList ?? []).map((item) => ({ ...item })),
  };
  if (params.isTerminated === 1) params.contractStatus = contractStatusEnum.terminated;
  if (type.value === 'add') delete params.id;
  try {
    await saveOrUpdate(params);
    message.success('保存成功');
    emit('success');
    closeModal();
    resetForm();
  } catch {
    message.error('保存失败，请稍后重试');
  } finally {
    state.loading = false;
  }
}
</script>

<style lang="less" scoped>
.section-title {
  margin: 8px 0 12px;
  padding-left: 10px;
  border-left: 2px solid #1677ff;
  font-weight: 600;
}
</style>
