<template>
  <BasicModal
    :title="title"
    :width="'60vw'"
    :height="540"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly" autocomplete="off">
        <a-row :gutter="24">
          <!-- <a-col :span="12">
            <a-form-item label="盘点编号" name="inventoryNum">
              <a-input v-model:value="state.formState.inventoryNum" disabled />
            </a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item label="盘点计划名称" name="inventoryName" :rules="[{ required: true, message: '请输入盘点计划名称' }]">
              <a-input v-model:value="state.formState.inventoryName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点区域" name="inventoryLocal" :rules="[{ required: true, message: '请选择盘点区域' }]">
              <a-select
                v-model:value="state.formState.inventoryLocal"
                :options="areaOptions"
                :field-names="{ label: 'storageName', value: 'id' }"
                allowClear
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开始时间" name="startTime" :rules="[{ required: true, message: '请选择开始时间' }]">
              <a-date-picker
                v-model:value="state.formState.startTime"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结束时间"
              name="endTime"
              :rules="[
                { required: true, message: '请选择结束时间' },
                { validator: validateEndTime, trigger: 'change' },
              ]"
            >
              <a-date-picker
                v-model:value="state.formState.endTime"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                placeholder="请选择"
                :disabled="readonly || !state.formState.startTime"
                :disabled-date="disabledEndDate"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="盘点人员" name="inventoryUserName" :rules="[{ required: true, message: '请选择盘点人员' }]">
              <div class="approval-user-select">
                <a-textarea disabled v-model:value="state.formState.inventoryUserName" allowClear />
                <a-button v-if="!readonly" type="primary" @click="handleSelectApprover('multiple')">选择</a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remark">
              <a-textarea v-model:value="state.formState.remark" :rows="3" :maxlength="200" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <selectUser @select="handleApproverSelected" @register="registerSelectUserModal" />
  </BasicModal>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { computed, reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { getStorageList, saveOrUpdate, getViewById } from '../line.api';
  import selectUser from '/@/components/selectUser/index.vue';

  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const type = ref('add');
  const row = ref<any>({});
  const areaOptions = ref<{ label: string; value: string }[]>([]); //区域
  const labelCol = { style: { width: '120px' } };
  const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

  const state = reactive({
    loading: false,
    formState: createDefaultFormState(),
  });

  const title = computed(() => {
    const typeMap = {
      add: '新增',
      edit: '编辑',
      view: '查看',
    };
    return typeMap[type.value] || '查看';
  });

  const readonly = computed(() => type.value === 'view');

  watch(
    () => state.formState.startTime,
    (startTime) => {
      if (!startTime) {
        state.formState.endTime = '';
        return;
      }
      if (state.formState.endTime && dayjs(state.formState.endTime).isBefore(dayjs(startTime))) {
        state.formState.endTime = '';
      }
    }
  );

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    type.value = data.type;
    row.value = data.row || {};
    resetForm();
    await getStoragesData();
    if (type.value === 'add') {
      return;
    }
    await getData();
  });

  // 当前选择的人
  const handleApproverSelected = (data, rows) => {
    console.log(data, rows);
    if (rows && rows.length > 0) {
      state.formState.inventoryUserId = data;
      state.formState.inventoryUserName = rows.map((item) => item.realname).join('，');
    }
  };
  //打开人员弹窗
  const [registerSelectUserModal, { openModal: openSelectUserModal }] = useModal();
  const handleSelectApprover = (type) => {
    let data: any = state.formState.inventoryUserId;
    if (typeof data === 'string') {
      const s = data.trim();
      data = s
        ? s
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
    }
    openSelectUserModal(true, { type, data });
  };
  //获取详情
  const getData = async () => {
    state.loading = true;
    const data = await getViewById({ id: row.value.id });
    if (data) Object.assign(state.formState, data);
    state.loading = false;
  };

  const resetForm = () => {
    formRef.value?.clearValidate?.();
    state.formState = createDefaultFormState();
    state.loading = false;
  };
  // 创建默认表单状态
  function createDefaultFormState() {
    return {
      id: '',
      inventoryNum: null,
      inventoryName: '',
      inventoryLocal: '',
      startTime: '',
      endTime: '',
      inventoryUserId: '',
      inventoryUserName: '',
      remark: '',
    };
  }
  const handleCancel = () => {
    resetForm();
  };
  // 提交
  const handleOk = async () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    await formRef.value?.validate();
    state.loading = true;
    try {
      const params = {
        ...state.formState,
        inventoryUserId: Array.isArray(state.formState.inventoryUserId)
          ? state.formState.inventoryUserId.join(',')
          : String(state.formState.inventoryUserId),
      };
      await saveOrUpdate(params);
      state.loading = false;
      message.success('保存成功');
      emit('success');
      closeModal();
      resetForm();
    } catch (error) {
      state.loading = false;
      message.error('保存失败，请稍后重试');
      return;
    } finally {
      state.loading = false;
    }
  };
  // 区域数据
  const getStoragesData = async () => {
    const res = await getStorageList();
    console.log(res);
    areaOptions.value = res || [];
    console.log(11111, areaOptions.value);
  };

  const disabledEndDate = (current) => {
    if (!state.formState.startTime) return false;
    return current && current.valueOf() < dayjs(state.formState.startTime).startOf('day').valueOf();
  };

  const validateEndTime = (rule, value, callback) => {
    if (!state.formState.startTime || !value) return callback();
    if (dayjs(value).isBefore(dayjs(state.formState.startTime))) {
      return callback('结束时间不能早于开始时间');
    }
    callback();
  };
</script>
<style>
  .approval-user-select {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
</style>
