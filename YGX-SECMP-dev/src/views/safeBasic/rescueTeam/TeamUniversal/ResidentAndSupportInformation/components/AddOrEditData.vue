<template>
    <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
                :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
                :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
                @cancel="handleCancel">
      <div class="h-full m-t-10" v-loading="state.loading">
        <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol"
                :disabled="readonly" autocomplete="off" ref="formRef">
          <!-- 第一行：驻地纬度 + 驻地经度 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="驻地纬度" name="stationLat" :rules="[{ required: true, message: '请输入驻地纬度' }]">
                <a-input v-model:value="state.formState.stationLat" placeholder="请输入驻地纬度" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="驻地经度" name="stationLng" :rules="[{ required: true, message: '请输入驻地经度' }]">
                <a-input v-model:value="state.formState.stationLng" placeholder="请输入驻地经度" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
  
          <!-- 第二行：办公及训练场地面积 + 物资储备仓库地址 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="办公及训练场地面积(㎡)" name="officeTrainingArea" :rules="[{ required: true, message: '请输入办公及训练场地面积' }]">
                <a-input-number v-model:value="state.formState.officeTrainingArea" :min="0" :precision="2" style="width: 100%" placeholder="请输入面积" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="物资储备仓库地址" name="materialWarehouseAddr" :rules="[{ required: true, message: '请输入物资储备仓库地址' }]">
                <a-input v-model:value="state.formState.materialWarehouseAddr" placeholder="请输入仓库地址" :rows="2" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
  
          <!-- 第三行：物资储备仓库面积 + 食宿保障人数 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="物资储备仓库面积(㎡)" name="materialWarehouseArea" :rules="[{ required: true, message: '请输入物资储备仓库面积' }]">
                <a-input-number v-model:value="state.formState.materialWarehouseArea" :min="0" :precision="2" style="width: 100%" placeholder="请输入面积" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="食宿保障人数" name="accommodationGuaranteeNum" :rules="[{ required: true, message: '请输入食宿保障人数' }]">
                <a-input-number v-model:value="state.formState.accommodationGuaranteeNum" :min="0" style="width: 100%" placeholder="请输入人数" />
              </a-form-item>
            </a-col>
          </a-row>
  
          <!-- 第四行：应急供电供水能力 + 经费来源 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="应急供电供水能力" name="rescuePowerWaterCapacity" :rules="[{ required: true, message: '请输入应急供电供水能力' }]">
                <a-input v-model:value="state.formState.rescuePowerWaterCapacity" placeholder="请输入能力描述（如：100kW/50t）" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="经费来源" name="fundSourceId" :rules="[{ required: true, message: '请选择经费来源' }]">
                <JDictSelectTag v-model:value="state.formState.fundSourceId" dictCode="fund_source_type" placeholder="请选择" />
              </a-form-item>
            </a-col>
          </a-row>
  
          <!-- 第五行：年度经费预算 + 保险投保情况 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="年度经费预算(元)" name="annualFundBudget" :rules="[{ required: true, message: '请输入年度经费预算' }]">
                <a-input-number v-model:value="state.formState.annualFundBudget" :min="0" :precision="2" style="width: 100%" placeholder="请输入预算" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="保险投保情况" name="insuranceId" :rules="[{ required: true, message: '请选择保险投保情况' }]">
                <JDictSelectTag v-model:value="state.formState.insuranceId" dictCode="insurance_type" placeholder="请选择" />
              </a-form-item>
            </a-col>
          </a-row>
  
          <!-- 第六行：应急通道规划（占整行） -->
          <a-row>
            <a-col :span="24">
              <a-form-item label="应急通道规划" name="rescueChannelPlan" :rules="[{ required: true, message: '请输入应急通道规划' }]">
                <a-textarea v-model:value="state.formState.rescueChannelPlan" placeholder="请输入应急通道规划" :rows="3" allowClear />
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
  import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的队伍驻地保障API
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  
  const emit = defineEmits(['success']);
  const formRef = ref();
  const labelCol = { style: { width: '180px' } }; // 适应较长标签
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      teamId: '', // 隐藏字段，可通过外部传入
      stationLat: '',
      stationLng: '',
      officeTrainingArea: undefined,
      materialWarehouseAddr: '',
      materialWarehouseArea: undefined,
      accommodationGuaranteeNum: undefined,
      rescuePowerWaterCapacity: '',
      fundSourceId: '',
      annualFundBudget: undefined,
      rescueChannelPlan: '',
      insuranceId: '',
    },
  });
  
  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}队伍驻地保障信息`;
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
          // 如果有 teamId 需要从父级传入，可在此赋值，如 params.teamId = props.teamId;
        }
  
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
  
  const resetForm = () => {
    state.formState = {
      id: '',
      teamId: '',
      stationLat: '',
      stationLng: '',
      officeTrainingArea: undefined,
      materialWarehouseAddr: '',
      materialWarehouseArea: undefined,
      accommodationGuaranteeNum: undefined,
      rescuePowerWaterCapacity: '',
      fundSourceId: '',
      annualFundBudget: undefined,
      rescueChannelPlan: '',
      insuranceId: '',
    };
    state.loading = false;
    formRef.value?.resetFields();
  };
  
  const handleCancel = () => {
    resetForm();
  };
  </script>
  
  <style lang="less" scoped></style>