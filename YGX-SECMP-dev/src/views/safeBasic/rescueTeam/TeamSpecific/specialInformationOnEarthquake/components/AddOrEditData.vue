<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：破拆救援装备 + 生命探测仪类型 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="破拆救援装备" name="breachEquipId" :rules="[{ required: true, message: '请选择破拆救援装备' }]">
              <JDictSelectTag v-model:value="state.formState.breachEquipId" placeholder="请选择"
                dictCode="breach_equip_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生命探测仪类型" name="detectorTypeId" :rules="[{ required: true, message: '请选择生命探测仪类型' }]">
              <JDictSelectTag v-model:value="state.formState.detectorTypeId" placeholder="请选择"
                dictCode="detector_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：生命探测仪数量 + 废墟救援训练场地 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="生命探测仪数量" name="detectorNum" :rules="[{ required: true, message: '请输入生命探测仪数量' }]">
              <a-input-number v-model:value="state.formState.detectorNum" :min="0" style="width: 100%"
                placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="废墟救援训练场地" name="rescueTrainingSite"
              :rules="[{ required: true, message: '请输入废墟救援训练场地' }]">
              <a-input v-model:value="state.formState.rescueTrainingSite" placeholder="请输入训练场地" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：队员搜救资质 + 可承受救援环境 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="队员搜救资质" name="staffEnvQual" :rules="[{ required: true, message: '请输入队员搜救资质' }]">
              <a-input v-model:value="state.formState.staffEnvQual" placeholder="请输入搜救资质" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可承受救援环境" name="rescueBearId" :rules="[{ required: true, message: '请选择可承受救援环境' }]">
              <JDictSelectTag v-model:value="state.formState.rescueBearId" placeholder="请选择"
                dictCode="rescue_bear_type" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 第四行：队员搜救资质 + 可承受救援环境 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="跨区域救援协作单位" name="affiliateId" :rules="[{ required: true, message: '请选择部门' }]">
              <a-tree-select v-model:value="state.formState.affiliateId" :tree-data="treeListData"
                :field-names="{ label: 'departName', value: 'id', children: 'children' }" placeholder="请选择部门"
                show-search tree-default-expand-all allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急通信保障设备" name="communicationId" :rules="[{ required: true, message: '请选择可承受救援环境' }]">
              <JDictSelectTag v-model:value="state.formState.communicationId" placeholder="请选择"
                dictCode="communication_type" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate, list, getViewById } from '../line.api';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '150px' } }; // 适应较长标签
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
const treeListData = ref([]);
const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamId: '', // 隐藏字段，可由父组件传入
    breachEquipId: '',
    detectorTypeId: '',
    detectorNum: undefined,
    rescueTrainingSite: '',
    staffEnvQual: '',
    rescueBearId: '',
    affiliateId: '',
    communicationId: '',
  },
});
onMounted(async () => {
  const res = await list();
  treeListData.value = res;
});
// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}地震救援专项信息`;
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
    const res = await getViewById({ id: row.value.id });
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
    breachEquipId: '',
    detectorTypeId: '',
    detectorNum: undefined,
    rescueTrainingSite: '',
    staffEnvQual: '',
    rescueBearId: '',
    affiliateId: '',
    communicationId: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>