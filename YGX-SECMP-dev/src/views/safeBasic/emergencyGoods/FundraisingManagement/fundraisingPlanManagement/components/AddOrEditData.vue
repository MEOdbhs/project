<template>
  <BasicModal :title="title" :width="'92vw'" :height="650" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" okText="确定" cancelText="取消" @register="registerModal"
    @ok="handleOk" @cancel="handleCancel">
    <div class="" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <div class="section-title">基本信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="计划名称" name="planName" :rules="[{ required: true, message: '请输入计划名称' }]">
              <a-input v-model:value="state.formState.planName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="编制部门" name="departmentId" :rules="[{ required: true, message: '请选择编制部门' }]">
              <template v-if="!readonly">
                <JSelectDept
                  v-model:value="state.formState.departmentId"
                  :sync="false"
                  :checkStrictly="true"
                  :defaultExpandLevel="2"
                />
              </template>
              <template v-else>
                <span>{{ state.formState.departmentName || '-' }}</span>
              </template>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人" name="personInChargeName" :rules="[{ required: true, message: '请输入负责人' }]">
              <a-input v-model:value="state.formState.personInChargeName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划日期" name="planDate" :rules="[{ required: true, message: '请选择计划日期' }]">
              <a-date-picker v-model:value="state.formState.planDate" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="需求日期" name="demandDate" :rules="[{ required: true, message: '请选择需求日期' }]">
              <a-date-picker v-model:value="state.formState.demandDate" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划状态" name="planStatus">
              <a-select v-model:value="state.formState.planStatus" :options="planStatusOptions" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="section-title">常规物资明细</div>
        <div class="mb-12px" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddDetailRecord">添加</a-button>
          <a-button danger @click="handleBatchDelete">删除</a-button>
        </div>
        <a-table class="fundraising-detail-table" :columns="detailColumns"
          :data-source="state.formState.fundraisingDetailList" :pagination="false"
          :row-key="(r) => r.rowId ?? r.id ?? ''" :row-selection="readonly ? undefined : rowSelection">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'materialTypeName'">
              <JDictSelectTag v-if="!readonly" v-model:value="record.materialTypeName" dictCode="yjaqxxk_material_type"
                placeholder="请选择物资类别" />
              <span v-else>{{ record.materialTypeName ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'materialName'">
              <a-input v-if="!readonly" v-model:value="record.materialName" allowClear />
              <span v-else>{{ record.materialName ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'quantity'">
              <a-input-number v-if="!readonly" v-model:value="record.quantity" :min="0" style="width: 100%" />
              <span v-else>{{ record.quantity ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'unit'">
              <JDictSelectTag v-if="!readonly" v-model:value="record.unit" dictCode="yjaqxxk_unit"
                placeholder="请选择单位" />
              <span v-else>{{ record.unit ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'estimatedBudget'">
              <a-input-number v-if="!readonly" v-model:value="record.estimatedBudget" :min="0" :precision="2"
                style="width: 100%" />
              <span v-else>{{ record.estimatedBudget ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'remarks'">
              <a-input v-if="!readonly" v-model:value="record.remarks" allowClear />
              <span v-else>{{ record.remarks ?? '-' }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly" @click="handleDeleteDetailRecord(record)">删除</a-button>
              <span v-else>-</span>
            </template>
          </template>
        </a-table>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import type { FundraisingPlanRecord, FundraisingDetailRecord } from '../line.api';
import { getViewById, saveOrUpdate } from '../line.api';
import { planStatusEnum } from '../line.data';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import JSelectDept from '/@/components/Form/src/jeecg/components/JSelectDept.vue';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const selectedRowKeys = ref<string[]>([]);
const type = ref('add');
const row = ref<any>({});

const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 140px)' } };

const planStatusOptions = [
  { label: '待开始', value: planStatusEnum.notStarted },
  { label: '进行中', value: planStatusEnum.processing },
  { label: '已完成', value: planStatusEnum.completed },
];

const detailColumns = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '物资类别', dataIndex: 'materialTypeName', width: 160 },
  { title: '物资名称', dataIndex: 'materialName', width: 200 },
  { title: '筹措数量', dataIndex: 'quantity', width: 120 },
  { title: '单位', dataIndex: 'unit', width: 120 },
  { title: '预计预算(元)', dataIndex: 'estimatedBudget', width: 160 },
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

const readonly = computed(() => type.value === 'view');

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: string[]) => {
      selectedRowKeys.value = keys;
    },
  };
});

watch(
  () => state.formState.fundraisingDetailList,
  (list) => {
    if (!Array.isArray(list)) {
      state.formState.estimatedBudget = undefined;
      return;
    }
    const total = list.reduce((sum, item) => {
      const value = Number(item.estimatedBudget ?? 0);
      if (Number.isNaN(value)) return sum;
      return sum + value;
    }, 0);
    state.formState.estimatedBudget = total || undefined;
  },
  { deep: true },
);

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') return;
  await getData();
});

function createDefaultFormState(): FundraisingPlanRecord {
  return {
    planName: '',
    departmentId: '',
    departmentName: '',
    personInChargeId: '',
    personInChargeName: '',
    planDate: '',
    demandDate: '',
    estimatedBudget: undefined,
    planStatus: planStatusEnum.notStarted,
    fundraisingDetailList: [],
  };
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

function getDetailRowKey(record: FundraisingDetailRecord) {
  return record.rowId ?? record.id ?? '';
}

function handleAddDetailRecord() {
  if (readonly.value) return;
  const rowId = `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  state.formState.fundraisingDetailList = state.formState.fundraisingDetailList ?? [];
  state.formState.fundraisingDetailList.push({
    rowId,
    materialType: '',
    materialTypeName: '',
    materialName: '',
    quantity: undefined,
    unit: '',
    estimatedBudget: undefined,
    remarks: '',
  });
}

function handleDeleteDetailRecord(record: FundraisingDetailRecord) {
  if (readonly.value) return;
  const key = getDetailRowKey(record);
  state.formState.fundraisingDetailList = (state.formState.fundraisingDetailList ?? []).filter(
    (item) => getDetailRowKey(item) !== key,
  );
  selectedRowKeys.value = selectedRowKeys.value.filter((k) => k !== key);
}

function handleBatchDelete() {
  if (readonly.value || !selectedRowKeys.value.length) return;
  const set = new Set(selectedRowKeys.value);
  state.formState.fundraisingDetailList = (state.formState.fundraisingDetailList ?? []).filter(
    (item) => !set.has(getDetailRowKey(item)),
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
  const params: FundraisingPlanRecord = {
    ...state.formState,
    fundraisingDetailList: (state.formState.fundraisingDetailList ?? []).map((item) => ({ ...item })),
  };
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
