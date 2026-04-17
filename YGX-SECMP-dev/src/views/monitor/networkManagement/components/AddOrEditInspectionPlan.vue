<template>
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="500"
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
    <div class="h-full m-t-10" v-loading="state.loading">
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
            <a-form-item label="巡检计划名称" name="inspectionPlanName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.inspectionPlanName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="巡检方式" name="inspectionWay" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag  v-model:value="state.formState.inspectionWay" placeholder="请选择"  dictCode="pm_device_video_inspection_way" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="巡检频次" name="frequency" :rules="[{ required: true, message: '请选择' }]">
              <a-select v-model:value="state.formState.frequency" placeholder="请选择" allowClear>
                <a-select-option v-for="value in inspectionMethodOptions" :key="value.value" :value="value.value">
                  {{ value.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
          
          <a-col :span="12">
            <a-form-item label="巡检负责人" name="inspectionUserId" :rules="[{ required: true, message: '请选择' }]">
              <a-select 
                v-model:value="state.formState.inspectionUserId"
                placeholder="请选择"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="巡检参与人员" name="inspectionJoinUserId" :rules="[{ required: true, message: '请选择' }]">
              <a-select 
                v-model:value="state.formState.inspectionJoinUserId"
                placeholder="请选择"
                mode="multiple"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          
          <a-col :span="12">
            <a-form-item label="开始时间" name="startDt" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.startDt"
                show-time
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间" name="endDt" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.endDt"
                show-time
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          
          <a-col :span="24">
            <a-form-item label="巡检内容" name="inspectionContent" :rules="[{ required: true, message: '请输入' }]">
              <a-textarea v-model:value="state.formState.inspectionContent" placeholder="请输入" rows="4" allowClear />
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
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { inspectionMethodOptions } from '../network.data';
import { getInspectionPlanSaveOrUpdate, getInspectionPlanGetViewById, listPageUserByOrgCode } from '../network.api';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();
const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '170px' } };
const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
const userList = ref([]);

const state = reactive({
  loading: false,
  formState: {
    id: '',
    inspectionWay: '',
    inspectionPlanName: '',
    inspectionContent: '',
    inspectionUserId: '',
    inspectionJoinUserId: [],
    frequency: '',
    status: 0,
    startDt: null,
    endDt: null,
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}巡检计划`;
});
let readonly = computed(() => {
  return type.value == 'view';
});

// 注册弹窗
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
    // 这里需要调用实际的API获取详情，暂时使用模拟数据
    const res = await getInspectionPlanGetViewById({ id: row.value.id });
    // const res = { ...row.value };
    // 转换日期字符串为 dayjs 对象
    if (res.startDt) {
      res.startDt = dayjs(res.startDt);
    }
    if (res.endDt) {
      res.endDt = dayjs(res.endDt);
    }
    // 将后端返回的字符串转回数组
    if (res.inspectionJoinUserId && typeof res.inspectionJoinUserId === 'string') {
      res.inspectionJoinUserId = res.inspectionJoinUserId.split(',');
    }
    Object.assign(state.formState, res);
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

const getUserList = async () => {
  try {
    const res = await listPageUserByOrgCode({ orgCode: userStore.currentEnterpriseCode });
    userList.value = res || [];
  } catch (error) {
    console.error('获取用户列表失败:', error);
    message.error('获取用户列表失败');
  }
};

// 搜索过滤
const filterOption = (input, option) => {
  return option.realname.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = { ...state.formState };
    params.orgCode = userStore.currentEnterpriseCode;
    // 转换 dayjs 对象为字符串格式
    if (params.startDt) {
      params.startDt = params.startDt.format('YYYY-MM-DD HH:mm:ss');
    }
    if (params.endDt) {
      params.endDt = params.endDt.format('YYYY-MM-DD HH:mm:ss');
    }
    // 将数组转换为逗号分隔的字符串
    if (Array.isArray(params.inspectionJoinUserId) && params.inspectionJoinUserId.length > 0) {
      params.inspectionJoinUserId = params.inspectionJoinUserId.join(',');
    }
    if (type.value === 'add') {
      delete params.id;
    }
    
    // 这里需要调用实际的API保存数据，暂时模拟成功
    getInspectionPlanSaveOrUpdate(params)
      emit('success');
      message.success('保存成功');
      closeModal();
      resetForm();
      state.loading = false;
  }).catch(() => {
    message.error('请检查表单填写');
  });
};

// 初始化表单值
const resetForm = () => {
  state.formState = {
    id: '',
    inspectionWay: '',
    inspectionPlanName: '',
    inspectionContent: '',
    inspectionUserId: '',
    inspectionJoinUserId: [],
    frequency: '',
    startDt: null,
    endDt: null,
    status: 0,
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};

onMounted(() => {
  getUserList();
});
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