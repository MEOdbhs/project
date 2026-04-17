<template>
  <BasicModal :title="title" :width="'90vw'" :height="650" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 设备基本信息 -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="设备类型" name="monitorCategoryId" :rules="[{ required: true, message: '请选择设备类型' }]">
              <JDictSelectTag v-model:value="state.formState.monitorCategoryId" placeholder="请选择"
                dictCode="monitor_category" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备名称" name="monitorName" :rules="[{ required: true, message: '请输入设备名称' }]">
              <a-input v-model:value="state.formState.monitorName" placeholder="请输入" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编码" name="monitorCode" :rules="[{ required: true, message: '请输入设备编码' }]">
              <a-input v-model:value="state.formState.monitorCode" placeholder="请输入" allowClear :maxlength="32" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计量单位" name="measureUnitId" :rules="[{ required: true, message: '请选择计量单位' }]">
              <JDictSelectTag v-model:value="state.formState.measureUnitId" placeholder="请选择"
                dictCode="measure_unit_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否启用" name="enableStatus" :rules="[{ required: true, message: '请选择是否启用' }]">
              <a-radio-group v-model:value="state.formState.enableStatus">
                <a-radio value="Y">是</a-radio>
                <a-radio value="N">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="阈值设置依据" name="thresholdBasis">
              <a-textarea v-model:value="state.formState.thresholdBasis" placeholder="请输入" :rows="2" :maxlength="500" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 仿真测试按钮 -->
        <div style="text-align: right; margin-top: 16px;">
          <a-button type="primary" @click="handleSimulationTest">仿真测试</a-button>
        </div>
        <!-- 条件配置区域 -->
        <a-divider orientation="left">预警规则配置</a-divider>
        <div>
          <a-button type="dashed" @click="addCondition" style="margin-bottom: 16px;">+ 添加条件</a-button>
          <a-table :dataSource="state.conditions" :columns="conditionColumns" :pagination="false" bordered>
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'action'">
                <a-button type="link" danger @click="removeCondition(index)">删除</a-button>
              </template>
              <template v-else-if="column.key === 'alarmThreshold'">
                <a-input-number v-model:value="record.alarmThreshold" :min="0" :precision="2" style="width: 100%"
                  placeholder="阈值" />
              </template>
              <template v-else-if="column.key === 'duration'">
                <a-input-number v-model:value="record.duration" :min="0" style="width: 100%" placeholder="持续时间" />
              </template>
              <template v-else-if="column.key === 'startEffectiveDatetime' || column.key === 'endEffectiveDatetime'">
                <a-date-picker v-model:value="record[column.key]" show-time format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss" placeholder="请选择" style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'dataTypeId'">
                <JDictSelectTag v-model:value="record.dataTypeId" placeholder="请选择" dictCode="alarm_data_type"
                  style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'paramTypeId'">
                <JDictSelectTag v-model:value="record.paramTypeId" placeholder="请选择" dictCode="alarm_param_type"
                  style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'alarmConditionId'">
                <JDictSelectTag v-model:value="record.alarmConditionId" placeholder="请选择"
                  dictCode="alarm_condition_type" style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'alarmUnitId'">
                <JDictSelectTag v-model:value="record.alarmUnitId" placeholder="请选择" dictCode="measure_unit_type"
                  style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'durationUnitId'">
                <JDictSelectTag v-model:value="record.durationUnitId" placeholder="请选择" dictCode="alarm_duration_unit"
                  style="width: 100%" />
              </template>
              <template v-else-if="column.key === 'alarmLevelId'">
                <JDictSelectTag v-model:value="record.alarmLevelId" placeholder="请选择" dictCode="monitor_alarm_level"
                  style="width: 100%" />
              </template>
              <template v-else>
                {{ record[column.key] }}
              </template>
            </template>
          </a-table>
        </div>


      </a-form>
    </div>

    <!-- 仿真测试弹窗 -->
    <SimulationTestModal @register="registerSimulationModal" @apply="handleApplySimulation" />
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate, getViewById } from '../line.api';
import SimulationTestModal from './SimulationTestModal.vue';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const [registerSimulationModal, { openModal: openSimulationModal }] = useModal();

const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

// 条件表格列定义（使用子表实体字段）
const conditionColumns = [
  { title: '数据类型', dataIndex: 'dataTypeId', key: 'dataTypeId', width: 150 },
  { title: '类型参数', dataIndex: 'paramTypeId', key: 'paramTypeId', width: 150 },
  { title: '条件', dataIndex: 'alarmConditionId', key: 'alarmConditionId', width: 120 },
  { title: '阈值', dataIndex: 'alarmThreshold', key: 'alarmThreshold', width: 100 },
  { title: '单位', dataIndex: 'alarmUnitId', key: 'alarmUnitId', width: 100 },
  { title: '持续时间', dataIndex: 'duration', key: 'duration', width: 100 },
  { title: '持续时间单位', dataIndex: 'durationUnitId', key: 'durationUnitId', width: 120 },
  { title: '预警等级', dataIndex: 'alarmLevelId', key: 'alarmLevelId', width: 120 },
  { title: '生效开始时间', dataIndex: 'startEffectiveDatetime', key: 'startEffectiveDatetime', width: 160 },
  { title: '生效结束时间', dataIndex: 'endEffectiveDatetime', key: 'endEffectiveDatetime', width: 160 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' },
];

const state = reactive({
  loading: false,
  formState: {
    id: '',
    monitorCode: '',
    monitorName: '',
    monitorCategoryId: '',
    monitorTypeId: '',        // 可能需要，根据实际表单
    measureUnitId: '',
    enableStatus: 'Y',
    thresholdBasis: '',
  },
  conditions: [], // 子表数据
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}规则配置`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  // 如果是新增，可能传入 deviceType 等，这里需要获取默认的设备类型？
  // 假设 data 中包含了主表部分信息（如 monitorCategoryId）
  if (data.deviceType) {
    state.formState.monitorCategoryId = data.deviceType;
  }
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    const res = await getViewById({ monitorCode: row.value.monitorCode });
    // 主表数据
    Object.assign(state.formState, res);
    // 子表数据映射：detailList -> conditions
    state.conditions = res.detailList
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
      // 构建 detailList
      params.detailList = state.conditions.map(cond => {
        const detail = {
          dataTypeId: cond.dataTypeId,
          paramTypeId: cond.paramTypeId,
          alarmConditionId: cond.alarmConditionId,
          alarmThreshold: cond.alarmThreshold,
          alarmUnitId: cond.alarmUnitId,
          duration: cond.duration,
          durationUnitId: cond.durationUnitId,
          alarmLevelId: cond.alarmLevelId,
          startEffectiveDatetime: cond.startEffectiveDatetime,
          endEffectiveDatetime: cond.endEffectiveDatetime,
        };
        if (cond.id) detail.id = cond.id;      // 编辑时携带 id
        return detail;
      });
      // 新增时删除 id
      if (type.value === 'add') delete params.id;
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
    monitorCode: '',
    monitorName: '',
    monitorCategoryId: state.formState.monitorCategoryId || '',
    monitorTypeId: '',
    measureUnitId: '',
    enableStatus: 'Y',
    thresholdBasis: '',
  };
  state.conditions = [];
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};

// 添加条件
const addCondition = () => {
  state.conditions.push({
    dataTypeId: '',
    paramTypeId: '',
    alarmConditionId: '',
    alarmThreshold: null,
    alarmUnitId: '',
    duration: null,
    durationUnitId: '',
    alarmLevelId: '',
    startEffectiveDatetime: null,
    endEffectiveDatetime: null,
  });
};

// 删除条件
const removeCondition = (index) => {
  state.conditions.splice(index, 1);
};

// 打开仿真测试弹窗
const handleSimulationTest = () => {
  openSimulationModal(true, { 
    conditions: state.conditions,
    deviceCode: state.formState.monitorCode   // 传入设备编码
  });
};

// 仿真测试弹窗应用回调
const handleApplySimulation = (data) => {
  console.log('仿真测试应用数据', data);
  if (data.updatedConditions) {
    state.conditions = data.updatedConditions;
  }
};
</script>

<style lang="less" scoped></style>