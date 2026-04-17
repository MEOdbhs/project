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
            <a-form-item label="入库单号" name="warehouseEntryNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.warehouseEntryNumber" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入库日期" name="warehouseEntryDate" :rules="[{ required: true, message: '请输入' }]">
              <a-date-picker
                v-model:value="state.formState.warehouseEntryDate"
                type="date"
                placeholder="请选择"
                allowClear
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="供应商" name="supplierId" :rules="[{ required: true, message: '请选择' }]">
              <ApiSelect v-model:value="state.formState.supplierId" placeholder="请选择" v-bind="supplierProps" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="关联合同号" name="contractNo" :rules="[{ required: true, message: '请输入' }]">
              <ApiSelect v-model:value="state.formState.contractNo" placeholder="请选择" v-bind="contractProps" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入库类型" name="storageType" :rules="[{ required: true, message: '请输入' }]">
              <JDictSelectTag v-model:value="state.formState.storageType" placeholder="请选择" dictCode="storageType" :showChooseOption="false" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="操作人" name="operator" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.operator" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">入库物资明细</a-divider>
          <a-col :span="12">
            <a-form-item label="物资编码" name="materialCode" :rules="[{ required: true, message: '请选择' }]">
              <div style="display: flex; align-items: center">
                <a-input v-model:value="state.formState.materialCode" placeholder="请输入" allowClear readonly />
                <a-button v-if="type != 'view'" type="primary" @click="handleSelectMaterial">选择物资</a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="物资名称" name="materialName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.materialName" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="规格型号" name="model" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.model" placeholder="请输入" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入库数量" name="entryNumber" :rules="[{ required: true, message: '请输入' }]">
              <a-input-number v-model:value="state.formState.entryNumber" placeholder="请输入" :precision="0" :min="0" allowClear />
              <label style="margin: 0 10px">单位</label>
              <a-input v-model:value="state.formState.unitName" placeholder="自动带出" allowClear style="width: 120px" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单价（元）" name="unitPrice" :rules="[{ required: true, message: '请输入' }]">
              <a-input-number v-model:value="state.formState.unitPrice" placeholder="请输入" :precision="2" :min="0" allowClear style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="金额（元）" name="allMoney" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.allMoney" placeholder="自动计算" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-divider orientation="left">入库信息</a-divider>
          <a-col :span="12">
            <a-form-item label="仓库" name="warehouseId" :rules="[{ required: true, message: '请输入' }]">
              <ApiSelect v-model:value="state.formState.warehouseId" placeholder="请选择" v-bind="storageProps" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="货架位置" name="warehouseAdderss">
              <a-input v-model:value="state.formState.warehouseAdderss" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全库存" name="safetyStock">
              <a-input v-model:value="state.formState.safetyStock" placeholder="自动带出" allowClear readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="当前库存" name="currentStock" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.currentStock" placeholder="自动带出" allowClear readonly />
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
    <SelectMaterial ref="selectMaterialRef" @register="registerSelectMaterial" @select="getMaterialInfo" />
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById, supplierInfo, emergencyMaterialStorage, contractInfoList } from '../rescueWarehousing.api';
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
import { message } from 'ant-design-vue';
import SelectMaterial from './SelectMaterial.vue';
import { useUserStore } from '/@/store/modules/user';
import Big from 'big.js';
const [registerSelectMaterial, { openModal }] = useModal();
const emit = defineEmits(['success', 'register']);

const formRef = ref();
const userStore = useUserStore();
console.log('userStore.getUserInfo', userStore.getUserInfo);
const labelCol = { style: { width: '170px' } };
const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
const state = reactive({
  loading: false,
  formState: {
    id: '',
    // 基本信息
    warehouseEntryNumber: '',
    warehouseEntryDate: null,
    supplierId: '',
    contractNo: '',
    storageType: '',
    operator: userStore.getUserInfo?.realname || '',
    // 入库物资明细
    materialCode: '',
    materialName: '',
    materialId: '',
    model: '',
    entryNumber: null,
    unit: '',
    unitPrice: null,
    allMoney: null,
    unitName: '',
    materialCurrentStock: null,
    // 入库信息
    warehouseId: '',
    warehouseAdderss: '',
    safetyStock: null,
    currentStock: null,
    remarks: '',
  },
});

const handleSelectMaterial = () => {
  openModal(true, {
    type: 'single',
    data: state.formState.materialId ? [state.formState.materialId] : [],
  });
};

const getMaterialInfo = (val, row) => {
  setMaterialInfo(row[0]);
};
const supplierProps = computed(() => ({
  api: supplierInfo,
  labelField: 'supplierName',
  valueField: 'id',
}));

const contractProps = computed(() => ({
  api: contractInfoList,
  labelField: 'contractName',
  valueField: 'id',
}));

const storageProps = computed(() => ({
  api: emergencyMaterialStorage,
  labelField: 'storageName',
  valueField: 'id',
}));

const setMaterialInfo = (cur) => {
  state.formState.materialCode = cur.materialCode;
  state.formState.unitPrice = cur.unitPrice;
  state.formState.materialName = cur.materialName;
  state.formState.materialId = cur.id;
  state.formState.model = cur.specification;
  //   state.formState.model = cur.model;
  state.formState.safetyStock = cur.safetyStock;
  state.formState.unit = cur.unit;
  state.formState.unitName = cur.unitName;
  state.formState.currentStock = cur.currentStock;
  state.formState.warehouseId = cur.emergencyMaterialStorageId;
  state.formState.warehouseAdderss = cur.shelfLocation;
  state.formState.materialCurrentStock = cur.currentStock;
};

watch(
  () => [state.formState.entryNumber, state.formState.unitPrice],
  ([entryNumber, unitPrice]) => {
    if (entryNumber && unitPrice) {
      state.formState.allMoney = new Big(entryNumber).times(new Big(unitPrice)).toFixed(2);
    }
    if (!entryNumber || !unitPrice) {
      state.formState.allMoney = null;
    }
    if (entryNumber === 0 || unitPrice === 0) {
      state.formState.allMoney = 0;
    }
  }
);

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
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
      .catch(() => {
        message.error('保存失败,请稍后再试');
      })
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
    warehouseEntryNumber: '',
    warehouseEntryDate: null,
    supplierId: '',
    contractNo: '',
    storageType: '',
    operator: userStore.getUserInfo?.realname || '',
    materialCode: '',
    materialName: '',
    materialId: '',
    model: '',
    entryNumber: null,
    unit: '',
    unitPrice: null,
    allMoney: null,
    warehouseId: '',
    warehouseAdderss: '',
    safetyStock: null,
    currentStock: null,
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