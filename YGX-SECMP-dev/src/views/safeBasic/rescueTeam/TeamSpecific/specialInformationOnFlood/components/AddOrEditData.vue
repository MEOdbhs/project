<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：抢险船只数量 + 抢险船只型号 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="抢险船只/冲锋舟数量" name="rescueBoatNum" :rules="[{ required: true, message: '请输入抢险船只数量' }]">
              <a-input-number v-model:value="state.formState.rescueBoatNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="抢险船只/冲锋舟型号" name="rescueBoatModel" :rules="[{ required: true, message: '请输入抢险船只型号' }]">
              <a-input v-model:value="state.formState.rescueBoatModel" placeholder="请输入型号" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：排水泵功率 + 排水泵数量 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="排水泵功率" name="pumpPower" :rules="[{ required: true, message: '请输入排水泵功率' }]">
              <a-input-number v-model:value="state.formState.pumpPower" :min="0" :precision="2" style="width: 100%" placeholder="请输入功率" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水泵数量" name="pumpNum" :rules="[{ required: true, message: '请输入排水泵数量' }]">
              <a-input-number v-model:value="state.formState.pumpNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：防汛沙袋储备量 + 堤坝加固装备 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="防汛沙袋储备量" name="sandbagStock" :rules="[{ required: true, message: '请输入防汛沙袋储备量' }]">
              <a-input-number v-model:value="state.formState.sandbagStock" :min="0" style="width: 100%" placeholder="请输入储备量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="堤坝加固装备" name="damReinEquip" :rules="[{ required: true, message: '请输入堤坝加固装备' }]">
              <a-input v-model:value="state.formState.damReinEquip" placeholder="请输入加固装备" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：救生装备数量 + 可处置险情类型 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="救生装备数量" name="lifeEquipNum" :rules="[{ required: true, message: '请输入救生装备数量' }]">
              <a-input-number v-model:value="state.formState.lifeEquipNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可处置险情类型" name="dangerTypeId" :rules="[{ required: true, message: '请选择可处置险情类型' }]">
              <JDictSelectTag v-model:value="state.formState.dangerTypeId" placeholder="请选择" dictCode="danger_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：涉水救援训练时长 + 与水文部门信息联动情况 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="涉水救援训练时长" name="waterTrainingHours" :rules="[{ required: true, message: '请输入涉水救援训练时长' }]">
              <a-input-number v-model:value="state.formState.waterTrainingHours" :min="0" :precision="1" style="width: 100%" placeholder="请输入时长" />
            </a-form-item>
          </a-col>
         
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="与水文部门信息联动情况" name="hydrologyLink" :rules="[{ required: true, message: '请输入联动情况' }]">
              <a-textarea v-model:value="state.formState.hydrologyLink" placeholder="请输入联动情况" :rows="3" allowClear />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的抗洪抢险专项API
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
    rescueBoatNum: undefined,
    rescueBoatModel: '',
    pumpPower: undefined,
    pumpNum: undefined,
    sandbagStock: undefined,
    damReinEquip: '',
    lifeEquipNum: undefined,
    dangerTypeId: '',
    waterTrainingHours: undefined,
    hydrologyLink: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}抗洪抢险专项信息`;
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
    rescueBoatNum: undefined,
    rescueBoatModel: '',
    pumpPower: undefined,
    pumpNum: undefined,
    sandbagStock: undefined,
    damReinEquip: '',
    lifeEquipNum: undefined,
    dangerTypeId: '',
    waterTrainingHours: undefined,
    hydrologyLink: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>