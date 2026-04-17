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
        name="materialStorageForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <!-- 基本信息 -->
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12" v-if="type !== 'add'">
            <a-form-item
              label="物资编码"
              name="materialCode"
              :rules="[{ required: true, message: '请输入物资编码' }]"
            >
              <a-input
                v-model:value="state.formState.materialCode"
                placeholder="请输入物资编码"
                readonly
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="物资名称"
              name="materialName"
              :rules="[{ required: true, message: '请输入物资名称' }]"
            >
              <a-input
                v-model:value="state.formState.materialName"
                placeholder="请输入物资名称"
                allowClear
              />
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
            <a-form-item label="规格" name="specification">
              <a-input v-model:value="state.formState.specification" placeholder="请输入规格" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="型号" name="model">
              <a-input v-model:value="state.formState.model" placeholder="请输入型号" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 库存信息 -->
        <a-divider orientation="left">库存信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="当前库存"
              name="currentStock"
              :rules="[{ required: true, message: '请输入当前库存数量' }]"
            >
              <a-input-number
                v-model:value="state.formState.currentStock"
                :min="0"
                style="width: 100%"
                placeholder="请输入当前库存数量"
                readonly
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
            <a-form-item label="安全库存" name="safetyStock">
              <a-input-number
                v-model:value="state.formState.safetyStock"
                :min="0"
                style="width: 100%"
                placeholder="请输入安全库存数量"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="仓储位置" name="storageName" :rules="[{ required: true, message: '请选择仓储位置' }]">
              <a-select
                v-model:value="state.formState.emergencyMaterialStorageId"
                :options="storageLocationOptions"
                placeholder="请选择仓储位置"
                allowClear
                show-search
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="货架位置" name="shelfLocation">
              <a-input
                v-model:value="state.formState.shelfLocation"
                placeholder="如：A-1-01"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 物资属性 -->
        <a-divider orientation="left">物资属性</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="参考单价（元）" name="unitPrice">
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
            <a-form-item label="参考总价（元）" name="totalPrice">
              <a-input-number
                :value="computedTotalPrice"
                disabled
                :min="0"
                :precision="2"
                style="width: 100%"
                placeholder="自动计算：当前库存×单价"
              />
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
          <a-col :span="12">
            <a-form-item label="保质期（月）" name="shelfLifeMonths">
              <a-input-number
                v-model:value="state.formState.shelfLifeMonths"
                :min="0"
                style="width: 100%"
                placeholder="请输入保质期（月）"
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
  import { saveOrUpdate, getById, getStorageLocation } from '../materialClassification.api';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

  const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'register', value: any): void;
  }>();

  const formRef = ref();
  const storageLocationOptions = ref<{ label: string; value: string | number }[]>([]);
  const labelCol = { style: { width: '200px' } };
  const wrapperCol = { style: { width: 'calc(100% - 200px)' } };

  const state = reactive({
    loading: false,
    formState: {
      id: undefined as number | undefined,
      materialCode: '',
      materialName: '',
      materialType: '',
      specification: '',
      model: '',
      currentStock: 0,
      safetyStock: undefined as number | undefined,
      unit: '',
      emergencyMaterialStorageId: undefined,
      storageName: '',
      shelfLocation: '',
      unitPrice: undefined as number | undefined,
      totalPrice: undefined as number | undefined,
      productionDate: '',
      shelfLifeMonths: undefined as number | undefined,
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
    return `${text}物资储备信息`;
  });

  const readonly = computed(() => type.value === 'view');

  /** 总价 = 当前库存 × 单价，只读展示，提交时写入 formState */
  const computedTotalPrice = computed(() => {
    const stock = Number(state.formState.currentStock);
    const price = Number(state.formState.unitPrice);
    if (Number.isNaN(stock) || Number.isNaN(price)) return undefined;
    const v = stock * price;
    return Math.round(v * 100) / 100;
  });

  const [registerModal, { closeModal }] = useModalInner((data?: { type: string; row?: any }) => {
    type.value = (data?.type as any) || 'add';
    row.value = data?.row || null;
    resetForm();
    if (row.value && row.value.id && (type.value === 'edit' || type.value === 'view')) {
      fetchDetail(row.value.id);
    }
  });

  const fetchStorageLocations = async () => {
    try {
      const res = await getStorageLocation({});
      if (Array.isArray(res)) {
        storageLocationOptions.value = res.map((item: any) => ({
          label: item.storageName,
          value: item.id,
        }));
      }
    } catch (error) {
      // ignore, 下拉为空时不影响主流程
      storageLocationOptions.value = [];
    }
  };

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

  const syncStorageName = () => {
    const match = storageLocationOptions.value.find(
      (item) => item.value === state.formState.emergencyMaterialStorageId,
    );
    state.formState.storageName = match?.label || '';
  };

  const handleOk = async () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    syncStorageName();
    try {
      await formRef.value.validate();
    } catch {
      return;
    }
    state.loading = true;
    try {
      // 总价由当前库存×单价计算，禁止手填，提交前统一写入
      if (computedTotalPrice.value !== undefined) {
        state.formState.totalPrice = computedTotalPrice.value;
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
      materialCode: '',
      materialName: '',
      materialType: '',
      specification: '',
      model: '',
      currentStock: 0,
      safetyStock: undefined,
      unit: '',
      emergencyMaterialStorageId: undefined,
      storageName: '',
      shelfLocation: '',
      unitPrice: undefined,
      totalPrice: undefined,
      productionDate: '',
      shelfLifeMonths: undefined,
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

  fetchStorageLocations();
</script>

<style scoped lang="less">
  :deep(.ant-form) {
    margin-right: 80px;
  }
</style>

