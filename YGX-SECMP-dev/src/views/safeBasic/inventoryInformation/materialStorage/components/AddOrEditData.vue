<template>
  <BasicModal
    :title="title"
    :width="'62vw'"
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
    <div v-loading="state.loading">
      <a-form
        ref="formRef"
        :model="state.formState"
        name="storageForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <!-- 仓储中心信息 -->
        <a-divider orientation="left">仓储中心信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12" v-if="type !== 'add'">
            <a-form-item
              label="仓储中心编码"
              name="storageCode"
              :rules="[{ required: true, message: '请输入仓储中心编码' }]"
            >
              <a-input v-model:value="state.formState.storageCode" readonly placeholder="请输入仓储中心编码" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="仓储中心名称"
              name="storageName"
              :rules="[{ required: true, message: '请输入仓储中心名称' }]"
            >
              <a-input v-model:value="state.formState.storageName" placeholder="请输入仓储中心名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="地址"
              name="address"
              :rules="[{ required: true, message: '请输入详细地址' }]"
            >
              <a-input v-model:value="state.formState.address" placeholder="请输入详细地址" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="24">
              <a-col :span="16">
                <a-form-item label="经纬度" :labelCol="{ style: { width: '200px' } }" name="longitude">
                  <a-input v-model:value="state.formState.longitude" placeholder="请输入经度" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="纬度" :labelCol="{ style: { width: '40px' } }" name="latitude">
                  <a-input v-model:value="state.formState.latitude" placeholder="请输入纬度" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人" name="contactPerson">
              <a-input v-model:value="state.formState.contactPerson" placeholder="请输入联系人" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="contactPhone">
              <a-input v-model:value="state.formState.contactPhone" placeholder="请输入联系电话" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 仓储容量信息 -->
        <a-divider orientation="left">仓储容量信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="总建筑面积(㎡)" name="totalBuildingArea">
              <a-input-number
                v-model:value="state.formState.totalBuildingArea"
                :min="0"
                style="width: 100%"
                placeholder="请输入总建筑面积"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="仓储面积(㎡)" name="storageArea">
              <a-input-number
                v-model:value="state.formState.storageArea"
                :min="0"
                style="width: 100%"
                placeholder="请输入仓储面积"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总容量(单位)" name="totalCapacity">
              <a-input-number v-model:value="state.formState.totalCapacity" :min="0" placeholder="请输入总容量" style="width: 100%" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已用容量(单位)" name="usedCapacity">
              <a-input-number v-model:value="state.formState.usedCapacity" :min="0" placeholder="请输入已用容量" style="width: 100%" allowClear />
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
import { saveOrUpdate, getById } from '../materialStorage.api';
  const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'register', value: any): void;
  }>();

  const formRef = ref();
  const labelCol = { style: { width: '200px' } };
  const wrapperCol = { style: { width: 'calc(100% - 200px)' } };

  const state = reactive({
    loading: false,
    formState: {
      id: undefined as number | undefined,
      storageCode: '',
      storageName: '',
      address: '',
      longitude: '',
      latitude: '',
      contactPerson: '',
      contactPhone: '',
      totalBuildingArea: undefined as number | undefined,
      storageArea: undefined as number | undefined,
      totalCapacity: '',
      usedCapacity: '',
    },
  });

  const type = ref<'add' | 'edit' | 'view'>('add');
  const row = ref<Record<string, any> | null>(null);

  const title = computed(() => {
    const text = type.value === 'add' ? '新增' : type.value === 'edit' ? '编辑' : '查看';
    return `${text}仓储物资信息`;
  });

  const readonly = computed(() => type.value === 'view');

  const [registerModal, { closeModal }] = useModalInner((data?: { type: string; row?: any }) => {
    type.value = (data?.type as any) || 'add';
    row.value = data?.row || null;
    resetForm();
    if (row.value && (type.value === 'edit' || type.value === 'view')) {
      getData();
    }
  });
const getData = async () => {
  state.loading = true;
  try {
    const res = await getById({ id: row.value?.id });
    Object.assign(state.formState, res);
  } finally {
    state.loading = false;
  }
};
  const handleOk = () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    formRef.value
      .validate()
      .then(async () => {
        state.loading = true;
        try {
          await saveOrUpdate(state.formState).then(() => {
            message.success('保存成功');
            closeModal();
            resetForm();
            emit('success');
          });
        } finally {
          state.loading = false;
        }
      })
      .catch(() => {
        state.loading = false;
      });
  };

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
    state.formState = {
      id: undefined,
      storageCode: '',
      storageName: '',
      address: '',
      longitude: '',
      latitude: '',
      contactPerson: '',
      contactPhone: '',
      totalBuildingArea: undefined,
      storageArea: undefined,
      totalCapacity: '',
      usedCapacity: '',
    };
    state.loading = false;
  };

  const handleCancel = () => {
    resetForm();
  };
</script>

<style scoped lang="less">
  :deep(.ant-form) {
    margin-right: 80px;
  }
</style>

