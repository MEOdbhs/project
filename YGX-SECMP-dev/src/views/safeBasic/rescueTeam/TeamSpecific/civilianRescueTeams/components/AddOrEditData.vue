<template>
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="600"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full" v-loading="state.loading">
      <a-form
        :model="state.formState"
        name="basic"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
        ref="formRef"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="队伍名称" name="name" :rules="[{ required: true, message: '请输入队伍名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备案登记" name="record" :rules="[{ required: true, message: '请输入备案登记' }]">
              <a-input v-model:value="state.formState.record" placeholder="请输入" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="人员构成" name="staff" :rules="[{ required: true, message: '请输入人员构成' }]">
              <a-textarea :rows="3" v-model:value="state.formState.staff" placeholder="请输入" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="装备保障" name="equip" :rules="[{ required: true, message: '请输入装备保障' }]">
              <a-textarea :rows="3" v-model:value="state.formState.equip" placeholder="请输入" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务能力" name="skill" :rules="[{ required: true, message: '请输入业务能力' }]">
              <a-textarea :rows="3" v-model:value="state.formState.skill" placeholder="请输入" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联动协作" name="coop" :rules="[{ required: true, message: '请输入联动协作' }]">
              <a-textarea :rows="3" v-model:value="state.formState.coop" placeholder="请输入" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="memo">
              <a-textarea :rows="2" v-model:value="state.formState.memo" placeholder="请输入" allowClear :maxlength="500" />
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
import { saveOrUpdate, getViewById } from '../line.api';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    record: '',
    staff: '',
    equip: '',
    skill: '',
    coop: '',
    memo: '',
  },
});

let type = ref('');
let row = ref({});
const title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}民间救援队伍`;
});
const readonly = computed(() => type.value == 'view');

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
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
  } finally {
    state.loading = false;
  }
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = { ...state.formState };
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

const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    name: '',
    record: '',
    staff: '',
    equip: '',
    skill: '',
    coop: '',
    memo: '',
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped>
.modal-content-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}
</style>