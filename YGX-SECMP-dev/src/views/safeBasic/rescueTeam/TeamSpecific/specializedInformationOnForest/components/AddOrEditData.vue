<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：森林消防装备清单 + 无人机巡护设备数量 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="森林消防装备清单" name="forestFireEquipId" :rules="[{ required: true, message: '请选择森林消防装备清单' }]">
              <JDictSelectTag v-model:value="state.formState.forestFireEquipId" placeholder="请选择" dictCode="forest_fire_equip_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="无人机巡护设备数量" name="uavNum" :rules="[{ required: true, message: '请输入无人机巡护设备数量' }]">
              <a-input-number v-model:value="state.formState.uavNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：无人机巡护设备型号 + 巡护路线规划 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="无人机巡护设备型号" name="uavModel" :rules="[{ required: true, message: '请输入无人机巡护设备型号' }]">
              <a-input v-model:value="state.formState.uavModel" placeholder="请输入型号" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="巡护路线规划" name="patrolRoute" :rules="[{ required: true, message: '请输入巡护路线规划' }]">
              <a-input v-model:value="state.formState.patrolRoute" placeholder="请输入巡护路线规划" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：可处置火情等级 + 森林防火隔离带作业能力 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="可处置火情等级" name="fireGradeId" :rules="[{ required: true, message: '请选择可处置火情等级' }]">
              <JDictSelectTag v-model:value="state.formState.fireGradeId" placeholder="请选择" dictCode="fire_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="森林防火隔离带作业能力" name="firebeltCap" :rules="[{ required: true, message: '请输入森林防火隔离带作业能力' }]">
              <a-input v-model:value="state.formState.firebeltCap" placeholder="请输入作业能力" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：队员野外生存保障物资 + 与气象部门联动情况 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="队员野外生存保障物资" name="survivalMat" :rules="[{ required: true, message: '请输入队员野外生存保障物资' }]">
              <a-input v-model:value="state.formState.survivalMat" placeholder="请输入保障物资"  allowClear />
            </a-form-item>
          </a-col>
         
          <a-col :span="12">
            <a-form-item label="年均火情处置次数" name="annualFireNum" :rules="[{ required: true, message: '请输入年均火情处置次数' }]">
              <a-input-number v-model:value="state.formState.annualFireNum" :min="0" style="width: 100%" placeholder="请输入次数" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：年均火情处置次数（占整行） -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="与气象部门联动情况" name="weatherLink" :rules="[{ required: true, message: '请输入与气象部门联动情况' }]">
              <a-textarea v-model:value="state.formState.weatherLink" placeholder="请输入联动情况"  allowClear />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的森林消防专项API
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '180px' } }; // 适应较长标签
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamId: '', // 隐藏字段，可由父组件传入
    forestFireEquipId: '',
    uavNum: undefined,
    uavModel: '',
    patrolRoute: '',
    fireGradeId: '',
    firebeltCap: '',
    survivalMat: '',
    weatherLink: '',
    annualFireNum: undefined,
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}森林消防专项信息`;
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
    forestFireEquipId: '',
    uavNum: undefined,
    uavModel: '',
    patrolRoute: '',
    fireGradeId: '',
    firebeltCap: '',
    survivalMat: '',
    weatherLink: '',
    annualFireNum: undefined,
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>