<template>
  <BasicModal
    :title="title"
    :width="'60vw'"
    :height="'50vh'"
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
        <a-row>
          <a-col :span="12">
            <a-form-item label="作业类型" name="workType" :rules="[{ required: true, message: '请选择作业类型' }]">
              <JDictSelectTag v-model:value="state.formState.workType" placeholder="请选择" dictCode="operation_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="作业开始时间" name="startTime" :rules="[{ required: true, message: '作业开始时间' }]">
              <a-date-picker
                v-model:value="state.formState.startTime"
                placeholder="请选择"
                style="width: 100%"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                :show-time="{ format: 'HH:mm' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="作业结束时间" name="endTime" :rules="[{ required: true, message: '作业开始时间' }]">
              <a-date-picker
                v-model:value="state.formState.endTime"
                placeholder="请选择"
                style="width: 100%"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                :show-time="{ format: 'HH:mm' }"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="作业单位" name="workUnit" :rules="[{ required: true, message: '请输入设备编号' }]">
              <a-input v-model:value="state.formState.workUnit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否第三方单位作业" name="isOther" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isOther">
                <a-radio :value="'1'">是</a-radio>
                <a-radio :value="'0'">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="作业地点" name="workPlace" :rules="[{ required: true, message: '请输入作业地点' }]">
              <a-input v-model:value="state.formState.workPlace" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="作业内容" name="workContent" :rules="[{ required: true, message: '请输入作业内容' }]">
              <a-input v-model:value="state.formState.workContent" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="作业负责人" name="workPerson" :rules="[{ required: true, message: '请选择作业负责人' }]">
              <a-select
                placeholder="请选择"
                v-model:value="state.formState.workPerson"
                labelInValue
                @change="handleUserChange"
                :options="userListData"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人手机号" name="personPhone" :rules="[{ required: true, message: '负责人手机号' }]">
              <a-input v-model:value="state.formState.personPhone" placeholder="请输入" allowClear :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="特殊作业人员"
              name="specialPerson"
              :rules="[{ required: true, message: '请选择特殊作业人员' }]"
            >
              <a-select
                v-model:value="state.formState.specialPerson"
                placeholder="请选择"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userListData"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { getViewById, userList, saveOrUpdate } from './specialAssignment.api';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      workType: '',
      startTime: '',
      endTime: '',
      isOther: '',
      workUnit: '',
      workPlace: '',
      workContent: '',
      workPerson: '',
      personPhone: '',
      specialPerson: '',
    },
  });
  // 人员列表
  const userListData = ref([]);
  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const typeMap = {
      add: '新增',
      edit: '编辑',
      view: '查看',
    };
    const str = typeMap[type.value] || '查看';
    return `${str}`;
  });
  let readonly = computed(() => {
    return type.value === 'view';
  });

  // 注册弹窗
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    console.log(data);

    row.value = data.row;
    type.value = data.type;
    resetForm();
    // 除了新增模式，其他模式都需要加载数据
    if (type.value !== 'add') {
      getData();
    }
  });

  const getData = async () => {
    state.loading = true;
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    state.loading = false;
  };

  // 处理提交
  const handleOk = () => {
    if (readonly.value) {
      closeModal();
      resetForm();
      return;
    }
    formRef.value
      .validate()
      .then(async () => {
        state.loading = true;
        let params = { ...state.formState };
        if (type.value === 'add') {
          delete params.id;
        }
        if (params.specialPerson) {
          params.specialPerson = params.specialPerson?.toString();
        }
        const { key } = params.workPerson;
        if (key) params.workPerson = key;
        const res = await saveOrUpdate(params);
        console.log(res);
        if (res) {
          emit('success');
          message.success('保存成功');
          closeModal();
          resetForm();
          state.loading = false;
        } else {
          message.error('保存失败,请稍后再试');
        }
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });
  };

  // 初始化表单值
  const resetForm = () => {
    formRef.value?.clearValidate();
    state.formState = {
      id: '',
      workType: '',
      startTime: '',
      endTime: '',
      isOther: '1',
      workUnit: '',
      workPlace: '',
      workContent: '',
      workPerson: '',
      personPhone: '',
      specialPerson: '',
    };
    state.loading = false;
  };

  const handleCancel = () => {
    resetForm();
  };
  onMounted(async () => {
    const res = await userList({ orgCode: userStore.currentEnterpriseCode, pageSize: 1000 });
    if (res && res.length) {
      userListData.value = res.map((item) => ({
        label: item.realname,
        value: item.id,
        phone: item.phone,
      }));
    }
  });
  // 处理负责人选择变化
  const handleUserChange = async (value) => {
    if (!value) {
      state.formState.personPhone = '';
      return;
    }
    state.formState.personPhone = value.option?.phone || '';
  };
  const filterOption = (input, option) => {
    if (!option?.label) return false;
    return option.label.toLowerCase().includes(input.toLowerCase());
  };
</script>
<style lang="less" scoped></style>
