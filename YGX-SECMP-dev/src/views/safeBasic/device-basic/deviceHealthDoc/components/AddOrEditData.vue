<template>
  <BasicModal :title="title" :width="'60vw'" :height="550" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" okText="确定" cancelText="取消" @register="registerModal"
    @ok="handleOk" @cancel="handleCancel">
    <div class="h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="设备类型" name="deviceType" :rules="[{ required: true, message: '请选择设备类型' }]">
              <JDictSelectTag v-model:value="state.formState.deviceType" placeholder="请选择" dictCode="safe_device_archive_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备名称" name="deviceName" :rules="[{ required: true, message: '请输入设备名称' }]">
              <a-input v-model:value="state.formState.deviceName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="型号规格" name="modelNorms" :rules="[{ required: true, message: '请输入型号规格' }]">
              <a-input v-model:value="state.formState.modelNorms" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编号" name="deviceCode" :rules="[{ required: true, message: '请输入设备编号' }]">
              <a-input v-model:value="state.formState.deviceCode" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产厂家" name="produceFactory" :rules="[{ required: true, message: '请输入生产厂家' }]">
              <a-input v-model:value="state.formState.produceFactory" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产日期" name="produceDate" :rules="[{ required: true, message: '请选择生产日期' }]">
              <a-date-picker v-model:value="state.formState.produceDate" placeholder="请选择" style="width: 100%" 
                valueFormat="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可使用期限" name="useExpired" :rules="[{ required: true, message: '请输入可使用期限' }]">
              <a-input-number v-model:value="state.formState.useExpired" placeholder="请输入" :min="0"
                style="width: 100%">
                <template #addonAfter>/月</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投用地点" name="locationUse" :rules="[{ required: true, message: '请输入投用地点' }]">
              <a-input v-model:value="state.formState.locationUse" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投用日期" name="dateOfUse" :rules="[{ required: true, message: '请选择投用日期' }]">
              <a-date-picker v-model:value="state.formState.dateOfUse" placeholder="请选择" style="width: 100%" 
                valueFormat="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="经度" name="longitude" :rules="[{ required: false, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.longitude" placeholder="请输入经度" 
                style="width: 100%" :precision="6" :min="-180" :max="180" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" name="latitude" :rules="[{ required: false, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.latitude" placeholder="请输入纬度" 
                style="width: 100%" :precision="6" :min="-90" :max="90" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人" name="directorId" :rules="[{ required: true, message: '请选择负责人' }]">
              <a-select 
                v-model:value="state.formState.directorId"
                placeholder="请选择"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
                :disabled="readonly"
                @change="handleDirectorChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人手机号" name="directorTel" :rules="[{ required: true, message: '请输入负责人手机号' }]">
              <a-input v-model:value="state.formState.directorTel" placeholder="请输入" allowClear 
                />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设备图片" name="fileIds" :rules="[{ required: false }]">
              <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id"
                :readonly="readonly" />
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
import { saveOrUpdate, getViewById, listPageUserByOrgCode } from '../line.api';
import { message } from 'ant-design-vue';
import FileUploadRecord from '/@/components/FileUpload/SimpleImageUpload.vue';
import { useUserStore } from '/@/store/modules/user';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
const userStore = useUserStore();
const userList = ref([]);

const state = reactive({
  loading: false,
  formState: {
    id: '',
    deviceName: '',
    deviceType: '',
    modelNorms: '',
    produceFactory: '',
    deviceCode: '',
    locationUse: '',
    produceDate: '',
    useExpired: undefined,
    dateOfUse: '',
    longitude: undefined,
    latitude: undefined,
    directorId: '',
    directorTel: '',
    fileIds: [],
  },
});

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

// 初始化表单值
const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    deviceName: '',
    deviceType: '',
    modelNorms: '',
    produceFactory: '',
    deviceCode: '',
    locationUse: '',
    produceDate: '',
    useExpired: undefined,
    dateOfUse: '',
    longitude: undefined,
    latitude: undefined,
    directorId: '',
    directorTel: '',
    fileIds: [],
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};

// 处理负责人选择变化
const handleDirectorChange = (value) => {
  if (!value) {
    state.formState.directorTel = '';
    return;
  }
  
  // 从用户列表中查找选中的用户
  const selectedUser = userList.value.find(user => user.id === value);
  if (selectedUser && selectedUser.phone) {
    state.formState.directorTel = selectedUser.phone;
  } else {
    state.formState.directorTel = '';
  }
};

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await listPageUserByOrgCode({ orgCode: userStore.currentEnterpriseCode });
    userList.value = res || [];
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
};

// 搜索过滤
const filterOption = (input, option) => {
  return option.realname.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

onMounted(() => {
  loadUserList();
});
</script>
<style lang="less" scoped></style>
