<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：危化品处置专业人员数量 + 专业资质 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="危化品处置专业人员数量" name="profStaffNum" :rules="[{ required: true, message: '请输入专业人员数量' }]">
              <a-input-number v-model:value="state.formState.profStaffNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业资质" name="profQualId" :rules="[{ required: true, message: '请选择专业资质' }]">
              <JDictSelectTag v-model:value="state.formState.profQualId" placeholder="请选择" dictCode="prof_qual_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：防化服及防护装备等级 + 危化品侦检设备 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="防化服及防护装备等级" name="protectiveGrade" :rules="[{ required: true, message: '请输入防护装备等级' }]">
              <a-input v-model:value="state.formState.protectiveGrade" placeholder="请输入等级" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="危化品侦检设备" name="detectEquipId" :rules="[{ required: true, message: '请选择侦检设备' }]">
              <JDictSelectTag v-model:value="state.formState.detectEquipId" placeholder="请选择" dictCode="detect_equip_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：处置装备 + 可处置危化品种类 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="处置装备" name="disposeEquip" :rules="[{ required: true, message: '请输入处置装备' }]">
              <a-input v-model:value="state.formState.disposeEquip" placeholder="请输入处置装备" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可处置危化品种类" name="chemTypeId" :rules="[{ required: true, message: '请选择危化品种类' }]">
              <JDictSelectTag v-model:value="state.formState.chemTypeId" placeholder="请选择" dictCode="chem_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：最大处置规模 + 与化工园区联动机制 -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="最大处置规模" name="maxDisposeScale" :rules="[{ required: true, message: '请输入最大处置规模' }]">
              <a-textarea v-model:value="state.formState.maxDisposeScale" placeholder="请输入规模":rows="3" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="与化工园区联动机制" name="parkLinkage" :rules="[{ required: true, message: '请输入联动机制' }]">
              <a-textarea v-model:value="state.formState.parkLinkage" placeholder="请输入联动机制" :rows="3" allowClear />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的危化品专项API
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
    profStaffNum: undefined,
    profQualId: '',
    protectiveGrade: '',
    detectEquipId: '',
    disposeEquip: '',
    chemTypeId: '',
    maxDisposeScale: '',
    parkLinkage: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}危化品专项信息`;
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
    profStaffNum: undefined,
    profQualId: '',
    protectiveGrade: '',
    detectEquipId: '',
    disposeEquip: '',
    chemTypeId: '',
    maxDisposeScale: '',
    parkLinkage: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>