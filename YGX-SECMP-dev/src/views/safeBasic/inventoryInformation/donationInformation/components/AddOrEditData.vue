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
        name="donationForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <!-- 捐赠者信息 -->
        <a-divider orientation="left">捐赠者信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="捐赠者姓名/单位"
              name="donorName"
              :rules="[{ required: true, message: '请输入捐赠者姓名或者单位名称' }]"
            >
              <a-input v-model:value="state.formState.donorName" placeholder="请输入捐赠者姓名或者单位名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="联系方式"
              name="contactInfo"
              :rules="[{ required: true, message: '请输入联系方式' }]"
            >
              <a-input v-model:value="state.formState.contactInfo" placeholder="请输入手机号或固定号码" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="捐赠日期"
              name="donationDate"
              :rules="[{ required: true, message: '请选择捐赠日期' }]"
            >
              <a-date-picker
                v-model:value="state.formState.donationDate"
                style="width: 100%"
                placeholder="请选择捐赠日期"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 捐赠物资信息 -->
        <a-divider orientation="left">捐赠物资信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="物资名称"
              name="materialName"
              :rules="[{ required: true, message: '请输入物资名称' }]"
            >
              <a-input v-model:value="state.formState.materialName" placeholder="请输入物资名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="物资类型"
              name="materialType"
              :rules="[{ required: true, message: '请选择物资类型' }]"
            >
              <JDictSelectTag
                v-model:value="state.formState.materialType"
                dictCode="yjaqxxk_material_type"
                placeholder="请选择物资类型"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="数量"
              name="quantity"
              :rules="[{ required: true, message: '请输入数量' }]"
            >
              <a-input-number
                v-model:value="state.formState.quantity"
                :min="0"
                style="width: 100%"
                placeholder="请输入物资数量"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="单位"
              name="unit"
              :rules="[{ required: true, message: '请选择单位' }]"
            >
              <JDictSelectTag
                v-model:value="state.formState.unit"
                dictCode="yjaqxxk_unit"
                placeholder="请选择单位"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单价（元）" name="unitPrice">
              <a-input-number
                v-model:value="state.formState.unitPrice"
                :min="0"
                :precision="2"
                style="width: 100%"
                placeholder="请输入单价"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总价（元）" name="totalPrice">
              <a-input-number
                v-model:value="state.formState.totalPrice"
                :min="0"
                :precision="2"
                style="width: 100%"
                placeholder="请输入总价"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 物资属性 -->
        <a-divider orientation="left">物资属性</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="规格" name="specification">
              <a-input v-model:value="state.formState.specification" placeholder="请输入规格" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="型号" name="model">
              <a-input v-model:value="state.formState.model" placeholder="请输入型号" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产日期" name="productionDate">
              <a-date-picker
                v-model:value="state.formState.productionDate"
                style="width: 100%"
                placeholder="请选择生产日期"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
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
  import { saveOrUpdate, getById } from '../donationInformation.api';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
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
      donorName: '',
      contactInfo: '',
      donationDate: '',
      materialName: '',
      materialType: '',
      quantity: undefined as number | undefined,
      unit: '',
      unitPrice: undefined as number | undefined,
      totalPrice: undefined as number | undefined,
      specification: '',
      model: '',
      productionDate: '',
      remarks: '',
      deleted: 0,
      version: 0,
      createBy: '',
      createDt: '',
      updateBy: '',
      updateDt: '',
      tenantId: undefined as number | undefined,
      materialTypeName: '',
      unitName: '',
    },
  });

  const type = ref<'add' | 'edit' | 'view'>('add');
  const row = ref<Record<string, any> | null>(null);

  const title = computed(() => {
    const text = type.value === 'add' ? '新增' : type.value === 'edit' ? '编辑' : '查看';
    return `${text}捐赠信息`;
  });

  const readonly = computed(() => type.value === 'view');

  const [registerModal, { closeModal }] = useModalInner((data?: { type: string; row?: any }) => {
    type.value = (data?.type as any) || 'add';
    row.value = data?.row || null;
    resetForm();
    if (row.value && row.value.id && (type.value === 'edit' || type.value === 'view')) {
      fetchDetail(row.value.id);
    }
  });

  const fetchDetail = async (id: number | string) => {
    state.loading = true;
    try {
      const res = await getById({ id });
      if (res) {
        Object.assign(state.formState, res);
      }
    } finally {
      state.loading = false;
    }
  };

  const handleOk = async () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    try {
      await formRef.value.validate();
    } catch {
      return;
    }
    state.loading = true;
    try {
      if (!state.formState.totalPrice && state.formState.unitPrice && state.formState.quantity) {
        state.formState.totalPrice = Number(state.formState.unitPrice) * Number(state.formState.quantity);
      }
      await saveOrUpdate(state.formState);
      message.success('保存成功');
      emit('success');
      closeModal();
      resetForm();
    } finally {
      state.loading = false;
    }
  };

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
    state.formState = {
      id: undefined,
      donorName: '',
      contactInfo: '',
      donationDate: '',
      materialName: '',
      materialType: '',
      quantity: undefined,
      unit: '',
      unitPrice: undefined,
      totalPrice: undefined,
      specification: '',
      model: '',
      productionDate: '',
      remarks: '',
      deleted: 0,
      version: 0,
      createBy: '',
      createDt: '',
      updateBy: '',
      updateDt: '',
      tenantId: undefined,
      materialTypeName: '',
      unitName: '',
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

