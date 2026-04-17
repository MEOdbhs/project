<template>
  <BasicModal :title="title" :width="'70vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <a-row>
          <a-col :span="12">
            <a-form-item label="站点名称" name="name" :rules="[{ required: true, message: '请输入站点名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="位置" name="location" :rules="[{ required: true, message: '请输入位置' }]">
              <a-input v-model:value="state.formState.location" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="监测项目" name="monitor" :rules="[{ required: true, message: '请输入监测项目' }]">
              <a-input v-model:value="state.formState.monitor" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建设日期" name="buildDatetime" :rules="[{ required: true, message: '请选择建设日期' }]">
              <a-date-picker v-model:value="state.formState.buildDatetime" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运维起始日期" name="opsStartDatetime" :rules="[{ required: true, message: '请选择运维起始日期' }]">
              <a-date-picker v-model:value="state.formState.opsStartDatetime" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />

            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备品牌型号" name="model" :rules="[{ required: true, message: '请输入设备品牌型号' }]">
              <a-input v-model:value="state.formState.model" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备参数" name="param" :rules="[{ required: true, message: '请输入设备参数' }]">
              <a-input v-model:value="state.formState.param" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运维单位" name="unit" :rules="[{ required: true, message: '请输入运维单位' }]">
              <a-input v-model:value="state.formState.unit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装方式" name="mount" :rules="[{ required: true, message: '请输入安装方式' }]">
              <a-input v-model:value="state.formState.mount" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数据传输方式" name="trans" :rules="[{ required: true, message: '请输入数据传输方式' }]">
              <a-input v-model:value="state.formState.trans" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdateMonitor, getMonitorViewById } from '../line.api';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '130px' } };
const wrapperCol = { style: { width: 'calc(100% - 130px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    location: '',
    monitor: '',
    buildDatetime: '',
    opsStartDatetime: '',
    model: '',
    param: '',
    unit: '',
    mount: '',
    trans: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}监测预警设施`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    const result = await getMonitorViewById({ id: row.value.id });
    Object.assign(state.formState, result);
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
      if (type.value === 'add') delete params.id;
      await saveOrUpdateMonitor(params);
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
    name: '',
    location: '',
    monitor: '',
    buildDatetime: '',
    opsStartDatetime: '',
    model: '',
    param: '',
    unit: '',
    mount: '',
    trans: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>