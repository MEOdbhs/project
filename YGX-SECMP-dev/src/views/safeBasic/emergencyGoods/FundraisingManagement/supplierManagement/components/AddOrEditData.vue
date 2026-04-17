<template>
  <BasicModal :title="title" :width="'70vw'" :height="650" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="supplier-add-edit-form h-full overflow-y-auto overflow-x-hidden" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <div class="section-title">基本信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="供应商名称" name="supplierName" :rules="[{ required: true, message: '请输入供应商名称' }]">
              <a-input v-model:value="state.formState.supplierName" allowClear placeholder="请输入供应商名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="供应商类别" name="supplierType" :rules="[{ required: true, message: '请选择供应商类别' }]">
              <JDictSelectTag v-model:value="state.formState.supplierType" dictCode="yjaqxxk_material_type"
                placeholder="请选择供应商类别" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人" name="contactPerson" :rules="[{ required: true, message: '请输入联系人' }]">
              <a-input v-model:value="state.formState.contactPerson" allowClear placeholder="请输入联系人" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="contactPhone" :rules="[{ required: true, message: '请输入联系电话' }]">
              <a-input v-model:value="state.formState.contactPhone" allowClear placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="地址" name="address">
              <a-input v-model:value="state.formState.address" allowClear placeholder="请输入地址" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="section-title">评估信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="供应商等级" name="supplierLevel" :rules="[{ required: true, message: '请选择供应商等级' }]">
              <JDictSelectTag v-model:value="state.formState.supplierLevel" dictCode="yjaqxxk_supplier_level"
                placeholder="请选择供应商等级" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合作状态" name="cooperationStatus" :rules="[{ required: true, message: '请选择合作状态' }]">
              <a-select v-model:value="state.formState.cooperationStatus" placeholder="请选择合作状态"
                :options="cooperationStatusOptions" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初始合作时间" name="cooperationStartTime">
              <a-date-picker v-model:value="state.formState.cooperationStartTime" valueFormat="YYYY-MM-DD"
                placeholder="请选择初始合作时间" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remarks">
              <a-textarea v-model:value="state.formState.remarks" :rows="3" allowClear placeholder="请输入备注" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import type { SupplierRecord } from '../line.api';
import { cooperationStatusEnum } from '../line.data';
import { getViewById, saveOrUpdate } from '../line.api';

const emit = defineEmits(['success', 'register']);

const formRef = ref();
const type = ref<'add' | 'edit' | 'view'>('add');
const row = ref<{ id?: string }>({});

const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const cooperationStatusOptions = [
  { label: '合作中', value: cooperationStatusEnum.working },
  { label: '暂停合作', value: cooperationStatusEnum.paused },
  { label: '终止合作', value: cooperationStatusEnum.terminated },
];

const state = reactive<{
  loading: boolean;
  formState: SupplierRecord;
}>({
  loading: false,
  formState: createDefaultFormState(),
});

const title = computed(() => {
  const map: Record<string, string> = {
    add: '新增供应商',
    edit: '修改供应商',
    view: '查看供应商',
  };
  return map[type.value] || '供应商信息';
});

const readonly = computed(() => type.value === 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type || 'add';
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') return;
  await getData();
});

function createDefaultFormState(): SupplierRecord {
  return {
    id: '',
    supplierName: '',
    supplierType: '',
    contactPerson: '',
    contactPhone: '',
    address: '',
    supplierLevel: '',
    cooperationStatus: undefined,
    cooperationStartTime: '',
    remarks: '',
  };
}

async function getData() {
  if (!row.value?.id) return;
  state.loading = true;
  try {
    const data = await getViewById({ id: row.value.id });
    if (data) {
      state.formState = {
        ...createDefaultFormState(),
        ...(data || {}),
      };
    }
  } catch (error: any) {
    message.error(error?.message || '获取供应商信息失败');
  } finally {
    state.loading = false;
  }
}

function resetForm() {
  formRef.value?.resetFields?.();
  state.formState = createDefaultFormState();
  state.loading = false;
}

function handleCancel() {
  resetForm();
}

async function handleOk() {
  if (readonly.value) {
    closeModal();
    return;
  }
  try {
    await formRef.value?.validate();
  } catch {
    message.error('请检查表单填写');
    return;
  }
  state.loading = true;
  try {
    const payload: SupplierRecord = { ...(state.formState || {}) };
    if (type.value === 'add') delete payload.id;
    await saveOrUpdate(payload);
    message.success('保存成功');
    emit('success');
    closeModal();
    resetForm();
  } catch (error: any) {
    message.error(error?.message || '保存失败，请稍后重试');
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

.supplier-add-edit-form {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  :deep(.ant-row) {
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-inline: 0 !important;
  }
}
</style>
