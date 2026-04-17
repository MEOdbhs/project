<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：装备总目录 + 特种装备清单 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="装备总目录" name="equipmentCatalog" :rules="[{ required: true, message: '请输入装备总目录' }]">
              <a-input v-model:value="state.formState.equipmentCatalog" placeholder="请输入装备总目录" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种装备清单" name="specialId" :rules="[{ required: true, message: '请选择特种装备清单' }]">
              <JDictSelectTag v-model:value="state.formState.specialId" dictCode="special_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：装备数量 + 装备完好率 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="装备数量" name="equipmentQuantity" :rules="[{ required: true, message: '请输入装备数量' }]">
              <a-input-number v-model:value="state.formState.equipmentQuantity" :min="0" style="width: 100%"
                placeholder="请输入装备数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="装备完好率(%)" name="equipmentIntactRate" :rules="[{ required: true, message: '请输入装备完好率' }]">
              <a-input-number v-model:value="state.formState.equipmentIntactRate" :min="0" :max="100" :precision="2"
                style="width: 100%" placeholder="请输入装备完好率" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：采购日期 + 维保记录 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="采购日期" name="equipmentPurchaseDate" :rules="[{ required: true, message: '请选择采购日期' }]">
              <a-date-picker v-model:value="state.formState.equipmentPurchaseDate" valueFormat="YYYY-MM-DD HH:mm:ss"
                show-time placeholder="请选择采购日期" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="维保记录" name="equipmentMaintenanceRecords"
              :rules="[{ required: true, message: '请输入维保记录' }]">
              <a-input v-model:value="state.formState.equipmentMaintenanceRecords" placeholder="请输入维保记录" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：车辆类型 + 车牌号 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="车辆类型" name="rescueVehicleType" :rules="[{ required: true, message: '请选择车辆类型' }]">
              <JDictSelectTag v-model:value="state.formState.rescueVehicleType" dictCode="rescue_vehicle_type"
                placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="车牌号" name="rescueVehiclePlate" :rules="[{ required: true, message: '请输入车牌号' }]">
              <a-input v-model:value="state.formState.rescueVehiclePlate" placeholder="请输入车牌号" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：核定载员 + 最大续航里程 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="核定载员" name="rescueVehicleApprovedNum" :rules="[{ required: true, message: '请输入核定载员' }]">
              <a-input-number v-model:value="state.formState.rescueVehicleApprovedNum" :min="0" style="width: 100%"
                placeholder="请输入核定载员" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最大续航里程(km)" name="rescueVehicleMaxMileage"
              :rules="[{ required: true, message: '请输入最大续航里程' }]">
              <a-input-number v-model:value="state.formState.rescueVehicleMaxMileage" :min="0" :precision="1"
                style="width: 100%" placeholder="请输入最大续航里程" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第六行：随车装备 + 个人防护配置标准 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="随车装备" name="rescueVehicleOnboardEquipment"
              :rules="[{ required: true, message: '请输入随车装备' }]">
              <a-input v-model:value="state.formState.rescueVehicleOnboardEquipment" placeholder="请输入随车装备" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="个人防护配置标准" name="ppeConfigStandard"
              :rules="[{ required: true, message: '请输入个人防护配置标准' }]">
              <a-input v-model:value="state.formState.ppeConfigStandard" placeholder="请输入个人防护配置标准" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第七行：个人防护库存数量 + 装备存储地点 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="个人防护库存数量" name="ppeStockQuantity" :rules="[{ required: true, message: '请输入个人防护库存数量' }]">
              <a-input-number v-model:value="state.formState.ppeStockQuantity" :min="0" style="width: 100%"
                placeholder="请输入个人防护库存数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="装备存储地点" name="equipmentStorageLocation"
              :rules="[{ required: true, message: '请输入装备存储地点' }]">
              <a-input v-model:value="state.formState.equipmentStorageLocation" placeholder="请输入装备存储地点" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第八行：装备管理责任人（占一列） -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="装备管理责任人" name="equipmentManagerName"
              :rules="[{ required: true, message: '请输入装备管理责任人' }]">
              <a-input v-model:value="state.formState.equipmentManagerName" placeholder="请输入装备管理责任人" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的装备管理API
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '140px' } }; // 稍微加宽标签以适应较长的中文
const wrapperCol = { style: { width: 'calc(100% - 140px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamId: '', // 隐藏字段，可通过外部传入或自动关联
    equipmentCatalog: '',
    specialId: '',
    equipmentQuantity: undefined,
    equipmentIntactRate: undefined,
    equipmentPurchaseDate: null,
    equipmentMaintenanceRecords: '',
    rescueVehicleType: '',
    rescueVehiclePlate: '',
    rescueVehicleApprovedNum: undefined,
    rescueVehicleMaxMileage: undefined,
    rescueVehicleOnboardEquipment: '',
    ppeConfigStandard: '',
    ppeStockQuantity: undefined,
    equipmentStorageLocation: '',
    equipmentManagerName: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}救援装备信息`;
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
  try {
    // 编辑或查看时，加载数据
    const res = { ...row.value };
    Object.assign(state.formState, res);
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

const handleOk = () => {
  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      let params = { ...state.formState };
      if (type.value === 'add') {
        delete params.id;
        // 如果有 teamId 需要从父级传入，可以在这里赋值，例如 params.teamId = props.teamId;
      }

      // 调用保存接口（请确认接口地址是否正确）
      await saveOrUpdate(params);
      emit('success');
      message.success('保存成功');
      closeModal();
      resetForm();
    } catch (error) {
      message.error(error.message || '保存失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请检查表单填写');
  });
};

// 初始化表单值
const resetForm = () => {
  state.formState = {
    id: '',
    teamId: '',
    equipmentCatalog: '',
    specialId: '',
    equipmentQuantity: undefined,
    equipmentIntactRate: undefined,
    equipmentPurchaseDate: null,
    equipmentMaintenanceRecords: '',
    rescueVehicleType: '',
    rescueVehiclePlate: '',
    rescueVehicleApprovedNum: undefined,
    rescueVehicleMaxMileage: undefined,
    rescueVehicleOnboardEquipment: '',
    ppeConfigStandard: '',
    ppeStockQuantity: undefined,
    equipmentStorageLocation: '',
    equipmentManagerName: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>