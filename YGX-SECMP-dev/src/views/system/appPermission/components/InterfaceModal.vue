<template>
  <BasicModal
    :title="title"
    :width="'40vw'"
    :height="450"
    :can-fullscreen="false"
    :keyboard="false"
    v-bind="$attrs"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full pl-10px pr-10px" v-loading="loading">
      <a-form
        :model="state.formState"
        name="basic"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
        ref="formRef"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="应用名称" name="appName">
              <a-input v-model:value="state.formState.appName" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="关联账号" name="appAccount">
              <div class="w-full select-user">
                <a-tag :bordered="false" color="#40a9ff" v-if="state.formState.appAccount">{{ state.formState.appAccount }}</a-tag>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="是否启用" name="status">
              <a-select ref="select" v-model:value="state.formState.status" style="width: 100%" disabled>
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" name="memo">
              <a-textarea v-model:value="state.formState.memo" :rows="4" :maxlength="100" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="接口授权" name="authPath">
              <!-- <a-textarea v-model:value="state.formState.authPath" :rows="4" :maxlength="100000" placeholder="多个接口之间用英文逗号分隔" /> -->
              <a-select v-model:value="state.authPath" mode="multiple" max-tag-length="10" style="width: 100%">
                <a-select-option v-for="i in state.authPathList" :key="i.id" :value="i.url">{{
                  i.interfaceName + i.url + '(' + i.memo + ')'
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { saveOrUpdate, getViewById, listInterfaceNoPage } from '../appPermission.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const state = reactive({
    loading: false,
    showOkBtn: true,
    formState: {
      id: '',
      //
      appAccount: '',
      appName: '',
      memo: '',
      status: undefined,
      authPath: '',
    },
    authPath: [],
    authPathList: [],
  });

  // 当前的弹窗数据
  let row = ref({});
  let title = '接口授权';
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    setForm();
    getData();
    state.showOkBtn = true;
  });
  const getData = async () => {
    state.loading = true;
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    const res1 = await listInterfaceNoPage();
    state.authPathList = res1;
    state.authPath = state.formState.authPath.split(',');
    state.loading = false;
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = state.formState;
      params.authPath = state.authPath.join(',');
      saveOrUpdate(params)
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
  const setForm = () => {
    state.formState = {
      id: '',
      //
      appAccount: '',
      appName: '',
      memo: '',
      status: undefined,
      authPath: '',
    };
    state.authPath = [];
    state.authPathList = [];
  };
  const handleCancel = () => {
    resetForm();
  };
</script>
<style lang="less" scoped>
  :deep(.select-user) {
    display: flex;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    min-height: 32px;
    align-items: center;
    padding: 4px 11px;
    flex-wrap: wrap;
    background-color: rgba(51, 51, 51, 0.04);
    cursor: not-allowed;
    .ant-tag {
      margin: 2px 6px;
    }
  }
</style>
