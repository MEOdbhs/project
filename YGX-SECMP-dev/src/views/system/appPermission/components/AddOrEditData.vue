<template>
  <BasicModal
    :title="title"
    :width="'40vw'"
    :height="300"
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
    <div class="h-full pl-10px pr-10px" v-loading="state.loading">
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
            <a-form-item label="应用名称" name="appName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.appName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="关联账号" name="appAccount" :rules="[{ required: true, message: '请选择' }]">
              <div :class="['w-full', 'select-user', getClass]">
                <a-tag :bordered="false" closable color="#40a9ff" v-if="state.formState.appAccount" @close="state.formState.appAccount = ''">{{
                  state.formState.appAccount
                }}</a-tag>
                <div class="add-icon">
                  <PlusOutlined @click="chooseUser" />
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="是否启用" name="status" :rules="[{ required: true, message: '请选择' }]">
              <a-select ref="select" v-model:value="state.formState.status" style="width: 100%" placeholder="请选择">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" name="memo">
              <a-textarea v-model:value="state.formState.memo" placeholder="请输入" :rows="2" :maxlength="100" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <UseSelectModal @register="registerSelectModal" @select-rows="selectRows" rowSelectionType="radio" />
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import UseSelectModal from '/@/views/system/role/components/UseSelectModal.vue';

  import { saveOrUpdate, getViewById } from '../appPermission.api';
  import { message } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '/@/enums/appEnum';
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
  });

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}应用`;
  });
  let readonly = computed(() => {
    return type.value == 'view';
  });
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    type.value = data.type;
    setForm();
    if (type.value == 'view' || type.value == 'edit') {
      getData();
    } else {
      // 默认启用
      state.formState.status = 1;
    }
    if (type.value == 'view') {
      state.showOkBtn = false;
    } else {
      state.showOkBtn = true;
    }
  });
  const [registerSelectModal, { openModal }] = useModal();

  const getData = async () => {
    state.loading = true;
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    state.loading = false;
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = state.formState;
      if (type.value === 'add') {
        delete params.id;
      }
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
  };
  const handleCancel = () => {
    resetForm();
  };
  const chooseUser = () => {
    openModal(true);
  };
  async function selectRows(val) {
    if (val && val.length > 0) {
      state.formState.appAccount = val[0].username;
    } else {
      state.formState.appAccount = '';
    }
    formRef.value.validate();
  }
  const { getDarkMode } = useRootSetting();
  const getClass = computed(() => {
    return getDarkMode.value === ThemeEnum.DARK ? 'select-user-dark' : 'select-user-light';
  });
</script>
<style lang="less" scoped>
  :deep(.select-user) {
    display: flex;
    border-radius: 4px;
    min-height: 32px;
    align-items: center;
    padding: 4px 11px;
    flex-wrap: wrap;
    .ant-tag {
      margin: 2px 6px;
    }
  }
  :deep(.select-user-light) {
    border: 1px solid #d9d9d9;
  }
  :deep(.select-user-dark) {
    border: 1px solid #163260;
  }
</style>
