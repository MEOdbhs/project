<template>
  <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="队长姓名" name="captainName" :rules="[{ required: true, message: '请输入队长姓名' }]">
              <a-input v-model:value="state.formState.captainName" placeholder="请输入队长姓名" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="队长职务" name="captainPosition" :rules="[{ required: true, message: '请输入队长职务' }]">
              <a-input v-model:value="state.formState.captainPosition" placeholder="请输入队长职务" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="队长联系电话" name="captainPhone" :rules="[
              { required: true, message: '请输入队长联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]">
              <a-input v-model:value="state.formState.captainPhone" placeholder="请输入队长联系电话" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="副队长姓名" name="viceCaptainName" :rules="[{ required: true, message: '请输入副队长姓名' }]">
              <a-input v-model:value="state.formState.viceCaptainName" placeholder="请输入副队长姓名" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="副队长分工" name="viceCaptainDuties" :rules="[{ required: true, message: '请输入副队长分工' }]">
              <a-input v-model:value="state.formState.viceCaptainDuties" placeholder="请输入副队长分工" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织结构" name="orgStructure" :rules="[{ required: true, message: '请选择组织结构' }]">
              <JDictSelectTag v-model:value="state.formState.orgStructure" dictCode="org_structure_type"
                placeholder="请选择" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="职责分工说明" name="respDivisionDesc" :rules="[{ required: true, message: '请输入职责分工说明' }]">
              <a-input v-model:value="state.formState.respDivisionDesc" placeholder="请输入职责分工说明" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管理制度版本" name="manageSystemVersion" :rules="[{ required: true, message: '请输入管理制度版本' }]">
              <a-input v-model:value="state.formState.manageSystemVersion" placeholder="请输入管理制度版本" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="管理制度名称" name="manageSystemName" :rules="[{ required: true, message: '请输入管理制度名称' }]">
              <a-input v-model:value="state.formState.manageSystemName" placeholder="请输入管理制度名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急联动单位" name="liaisonUnit" :rules="[{ required: true, message: '请输入应急联动单位' }]">
              <a-input v-model:value="state.formState.liaisonUnit" placeholder="请输入应急联动单位" :rows="3" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="骨干姓名" name="backboneName" :rules="[{ required: true, message: '请输入骨干姓名' }]">
              <a-input v-model:value="state.formState.backboneName" placeholder="请输入骨干姓名" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="骨干联系方式" name="backbonePhone" :rules="[{ required: true, message: '请输入骨干联系方式' }]">
              <a-input v-model:value="state.formState.backbonePhone" placeholder="请输入骨干联系方式" :rows="3" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="联络方式" name="contactMethod" :rules="[
              { required: true, message: '请输入联络方式' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]">
              <a-input v-model:value="state.formState.contactMethod" placeholder="请输入联络方式" allowClear />
            </a-form-item>
          </a-col>
         
          <a-col :span="24">
            <a-form-item label="训练演练计划" name="trainDrillPlan" :rules="[{ required: true, message: '请输入训练演练计划' }]">
              <a-textarea v-model:value="state.formState.trainDrillPlan" placeholder="请输入训练演练计划" :rows="3" allowClear />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的队伍组织API
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamId: '',
    captainName: '',
    captainPosition: '',
    captainPhone: '',
    viceCaptainName: '',
    viceCaptainDuties: '',
    orgStructure: '',
    respDivisionDesc: '',
    manageSystemName: '',
    manageSystemVersion: '',
    trainDrillPlan: '',
    liaisonUnit: '',
    backbonePhone:'',
    contactMethod: '',
    backboneName:'',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}队伍组织信息`;
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
    captainName: '',
    captainPosition: '',
    captainPhone: '',
    viceCaptainName: '',
    viceCaptainDuties: '',
    orgStructure: '',
    respDivisionDesc: '',
    manageSystemName: '',
    manageSystemVersion: '',
    trainDrillPlan: '',
    liaisonUnit: '',
    backboneName:'',
    backbonePhone: '',
    contactMethod: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>