<template>
  <BasicModal
    :title="title"
    :width="'50vw'"
    :height="250"
    :can-fullscreen="false"
    :maskClosable="false"
    :keyboard="false"
    v-bind="$attrs"
    @register="registerModal"
    cancelText="关闭"
    okText="确定"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="pl-10px pr-10px h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="24">
            <a-form-item label="部署文件">
              <j-upload-button @click="onImport" type="primary" :accept="accept" preIcon="ant-design:arrow-up-outlined">选择文件</j-upload-button>
              仅支持 bpmn、bar 、zip格式,且大小不超过100M
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="文件" name="file" :rules="[{ required: true, message: '请选择文件' }]">
              <div v-show="state.formState.file" class="flex flex-items-center flex-justify-between pa-4px" :style="{ backgroundColor: '#2e7adc' }">
                <div>{{ state.formState.filename }}</div>
                <div>
                  <DeleteOutlined style="font-size: 14px; color: red; cursor: pointer" @click="removeFile" />
                </div>
              </div>
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
  import { uploadworkflow } from '../flowRelease.api';
  import { message } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';

  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const state = reactive({
    loading: false,
    formState: {
      file: null,
      filename: '',
    },
  });

  // 当前的弹窗数据
  const title = computed(() => {
    const str = '上传部署文件';
    return str;
  });
  const accept = computed(() => {
    return '.bpmn,.bar,.zip';
  });
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
    resetForm();
  });

  const resetForm = () => {
    state.formState = {
      file: null,
      filename: '',
    };
    formRef.value.clearValidate();
  };
  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = {
        name: 'uploadfile',
        file: state.formState.file.file,
      };
      uploadworkflow(params)
        .then(() => {
          emit('success');
          message.success('保存成功');
          closeModal();
          resetForm();
        })
        .catch(() => {
          message.error('保存失败,请稍后再试');
        })
        .finally(() => {
          state.loading = false;
        });
    });
  };
  const handleCancel = () => {
    resetForm();
  };
  const onImport = (file) => {
    const val = 100;
    const isLt = file.file.size / 1024 / 1024 < val;
    if (!isLt) {
      message.error('文件大小超过限制!');
      return;
    }
    state.formState.file = file;
    state.formState.filename = file?.file?.name;
    formRef.value.validateFields();
  };
  const removeFile = () => {
    state.formState.file = null;
    state.formState.filename = '';
  };
</script>
<style></style>
