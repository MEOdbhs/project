<template>
  <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：化学品编号 + 化学品主名称 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="化学品编号" name="chemicalCode" :rules="[{ required: true, message: '请输入化学品编号' }]">
              <a-input v-model:value="state.formState.chemicalCode" placeholder="请输入化学品编号" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="化学品主名称" name="mainName" :rules="[{ required: true, message: '请输入化学品主名称' }]">
              <a-input v-model:value="state.formState.mainName" placeholder="请输入化学品主名称" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：别名/形态（占整行） -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="别名/形态" name="alias" :rules="[{ required: true, message: '请输入别名/形态' }]">
              <a-input v-model:value="state.formState.alias" placeholder="请输入别名/形态" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：储存要求（占整行，使用文本域） -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="储存要求" name="storageRequirement" :rules="[{ required: true, message: '请输入储存要求' }]">
              <a-textarea v-model:value="state.formState.storageRequirement" placeholder="请输入储存要求" :rows="4" :maxlength="65535" />
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
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    chemicalCode: '',
    mainName: '',
    alias: '',
    storageRequirement: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}化学品信息`;
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
    // 编辑或查看时，将行数据赋值给表单
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
      await saveOrUpdate(params); // 调用保存接口
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
    chemicalCode: '',
    mainName: '',
    alias: '',
    storageRequirement: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>