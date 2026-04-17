<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：消防车辆类型 + 消防车辆数量 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="消防车辆类型" name="truckTypeId" :rules="[{ required: true, message: '请选择消防车辆类型' }]">
              <JDictSelectTag v-model:value="state.formState.truckTypeId" placeholder="请选择" dictCode="truck_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="消防车辆数量" name="truckNum" :rules="[{ required: true, message: '请输入消防车辆数量' }]">
              <a-input-number v-model:value="state.formState.truckNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：消防水源接口位置 + 消防水源接口容量 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="消防水源接口位置" name="waterInterfaceLoc" :rules="[{ required: true, message: '请输入消防水源接口位置' }]">
              <a-input v-model:value="state.formState.waterInterfaceLoc" placeholder="请输入接口位置" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="消防水源接口容量" name="waterInterfaceCap" :rules="[{ required: true, message: '请输入消防水源接口容量' }]">
              <a-input-number v-model:value="state.formState.waterInterfaceCap" :min="0" :precision="2" style="width: 100%" placeholder="请输入容量" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：特种消防装备 + 可处置火灾类型 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="特种消防装备" name="specialEquipId" :rules="[{ required: true, message: '请选择特种消防装备' }]">
              <JDictSelectTag v-model:value="state.formState.specialEquipId" placeholder="请选择" dictCode="special_equip_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可处置火灾类型" name="fireTypeId" :rules="[{ required: true, message: '请选择可处置火灾类型' }]">
              <JDictSelectTag v-model:value="state.formState.fireTypeId" placeholder="请选择" dictCode="fire_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：最大单次救援承载力 + 消防员持证上岗情况 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="最大单次救援承载力" name="maxRescueBear" :rules="[{ required: true, message: '请输入最大单次救援承载力' }]">
              <a-input-number v-model:value="state.formState.maxRescueBear" :min="0" style="width: 100%" placeholder="请输入承载力" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="消防员持证上岗情况" name="firemanCertId" :rules="[{ required: true, message: '请选择持证上岗情况' }]">
              <JDictSelectTag v-model:value="state.formState.firemanCertId" placeholder="请选择" dictCode="fireman_cert_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：年均出警次数 + 年均出警成功率 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="年均出警次数" name="annualAlarmNum" :rules="[{ required: true, message: '请输入年均出警次数' }]">
              <a-input-number v-model:value="state.formState.annualAlarmNum" :min="0" style="width: 100%" placeholder="请输入次数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年均出警成功率(%)" name="annualAlarmSuccessRate" :rules="[{ required: true, message: '请输入年均出警成功率' }]">
              <a-input-number v-model:value="state.formState.annualAlarmSuccessRate" :min="0" :max="100" :precision="2" style="width: 100%" placeholder="请输入成功率" />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的消防专项API
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '150px' } }; // 适应较长标签
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    truckTypeId: '',
    truckNum: undefined,
    waterInterfaceLoc: '',
    waterInterfaceCap: undefined,
    specialEquipId: '',
    fireTypeId: '',
    maxRescueBear: undefined,
    firemanCertId: '',
    annualAlarmNum: undefined,
    annualAlarmSuccessRate: undefined,
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}消防专项信息`;
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
    truckTypeId: '',
    truckNum: undefined,
    waterInterfaceLoc: '',
    waterInterfaceCap: undefined,
    specialEquipId: '',
    fireTypeId: '',
    maxRescueBear: undefined,
    firemanCertId: '',
    annualAlarmNum: undefined,
    annualAlarmSuccessRate: undefined,
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>