<template>
  <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 隐藏ID字段 -->
        <input type="hidden" v-model="state.formState.id" />
        <input type="hidden" v-model="state.formState.entId" />

        <a-row>
          <a-col :span="12">
            <a-form-item label="是否涉及危险源" name="hazardInvolve" :rules="[{ required: true, message: '请选择是否涉及危险源' }]">
              <a-radio-group v-model:value="state.formState.hazardInvolve" button-style="solid">
                <a-radio-button value="Y">是</a-radio-button>
                <a-radio-button value="N">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最高危险源等级" name="maxHazardLevel" :rules="[{ required: true, message: '请输入最高危险源等级' }]">
              <a-input v-model:value="state.formState.maxHazardLevel" placeholder="请输入最高危险源等级" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="是否使用特种设备" name="specialEquipUsage" :rules="[{ required: true, message: '请选择是否使用特种设备' }]">
              <a-radio-group v-model:value="state.formState.specialEquipUsage" button-style="solid">
                <a-radio-button value="Y">是</a-radio-button>
                <a-radio-button value="N">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种设备种类" name="specialEquipType" :rules="[{ required: true, message: '请输入特种设备种类' }]">
              <a-input v-model:value="state.formState.specialEquipType" placeholder="请输入特种设备种类" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="是否使用危险设备" name="hazardEquipUsage" :rules="[{ required: true, message: '请选择是否使用危险设备' }]">
              <a-radio-group v-model:value="state.formState.hazardEquipUsage" button-style="solid">
                <a-radio-button value="Y">是</a-radio-button>
                <a-radio-button value="N">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否涉及危险工艺" name="hazardProcessInvolve" :rules="[{ required: true, message: '请选择是否涉及危险工艺' }]">
              <a-radio-group v-model:value="state.formState.hazardProcessInvolve" button-style="solid">
                <a-radio-button value="Y">是</a-radio-button>
                <a-radio-button value="N">否</a-radio-button>
              </a-radio-group>
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
import { saveOrUpdate } from '../line.api'; 

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    entId: '',
    hazardInvolve: undefined,
    maxHazardLevel: '',
    specialEquipUsage: undefined,
    specialEquipType: '',
    hazardEquipUsage: undefined,
    hazardProcessInvolve: undefined,
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}重大危险源信息`;
});
let readonly = computed(() => type.value == 'view');

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
    Object.assign(state.formState, { ...row.value });
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
        delete params.id; // 新增时移除id字段
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
    entId: '',
    hazardInvolve: undefined,
    maxHazardLevel: '',
    specialEquipUsage: undefined,
    specialEquipType: '',
    hazardEquipUsage: undefined,
    hazardProcessInvolve: undefined,
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>